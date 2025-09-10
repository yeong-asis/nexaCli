import Octicons from 'react-native-vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, StatusBar, Text, TextInput as TextInputs, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { COLORS } from '../../themes/theme';
import { LoginManagementCSS, ButtonCSS, defaultCSS, FooterCSS } from '../../themes/CSS';
import KeyboardAvoidWrapper from '../functions/KeyboardAvoidWrapper';
import { IPAddress } from '../../objects/objects';
import { ForceNewFCMToken } from '../functions/pushNotification';
import DeviceInfo from 'react-native-device-info';
import uuid from 'react-native-uuid';
import Snackbar from 'react-native-snackbar';

const LoginScreen = ({navigation}: any) => {
    const [processData, setProcessData] = useState(false);
    const appVersion = DeviceInfo.getVersion();
    
    const [userName, setUserName] = useState('pakmy@asis-technologies.com');
    const [password, setPassword] = useState('Asis!234');
    // const [userName, setUserName] = useState('');
    // const [password, setPassword] = useState('');
    const [ishide, setishide] = useState(true);
    const inputRef = React.createRef<TextInputs>();
    const [usernameHelperText, setusernameHelperText] = useState(false);
    const [passwordHelperText, setpasswordHelperText] = useState(false);

    const CallLoginAPI = async (username: any, password: any) => {
        setProcessData(true);
        let emtpy = false;

        if (username === '') {
            setusernameHelperText(true)
            emtpy = true;
            setProcessData(false);
        } else {
            setusernameHelperText(false)
        }

        if (password === '') {
            setpasswordHelperText(true)
            emtpy = true;
            setProcessData(false);
        } else {
            setpasswordHelperText(false)
        }

        if (!emtpy) {
            try {
                await ForceNewFCMToken();
                const showFCMToken = await AsyncStorage.getItem('fcmtoken') ?? "";
                const GUIDToken = uuid.v4(); 

                const request = {
                    "User": {
                        "Username": username,
                        "Password": password
                    },
                    "FCMToken": {
                        "GuildToken": GUIDToken,
                        "FCMToken": showFCMToken
                    }
                }

                // POST request
                const response = await axios.post(
                    "http://192.168.168.150/NEXA/api/Authentication/post",
                    request,
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const responseData=response.data;
                if(responseData.Acknowledge==0) {
                    await AsyncStorage.setItem('UserID', responseData.User.Id.toString());
                    await AsyncStorage.setItem('RoleID', responseData.Role.Id.toString());
                    await AsyncStorage.setItem('FullName', responseData.User.Name);
                    await AsyncStorage.setItem('Email', responseData.User.Email);
                    navigation.navigate("Tab", { screen: 'Dashboard'});
                    setProcessData(false);
                }else{
                    Snackbar.show({
                        text: 'Login Fail, Please try again.',
                        duration: Snackbar.LENGTH_LONG,
                    });
                    setProcessData(false);
                }

            }catch (error: any) {
                console.log("Error: "+error);
                setProcessData(false);
            }
        }
    }

    return (
         <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />

            {processData && (
                <View style={defaultCSS.loadingScreen}>
                    <ActivityIndicator size={50} color={COLORS.primaryWhiteHex} />
                    <Text style={{ marginTop: 10, color: COLORS.primaryWhiteHex }}>Loading...</Text>
                </View>
            )}

            <KeyboardAvoidWrapper>
                <View style={{ flex: 1}}>
                    {/* Logo */}
                    <View style={[LoginManagementCSS.widthAndAdjustment]}>
                        <Image 
                        source={require('../../assets/asislogo.png')} 
                        style={{ 
                            height: Dimensions.get("screen").height * 0.35, 
                            width: Dimensions.get("screen").width *0.8, 
                            resizeMode: 'contain', 
                            alignSelf: "center",
                        }} />
                    </View>

                    {/* Form Card */}
                    <View style={[LoginManagementCSS.widthAndAdjustment, LoginManagementCSS.CardShadow]}>
                        <View style={[LoginManagementCSS.CardContainer, {padding: 25, }]}>
                            <View style={{flexDirection: "column", marginTop: 20}}>
                                <Text style={LoginManagementCSS.TextInputFont}>Please enter your credential</Text>
                            </View>

                            <View style={{flexDirection: "column", marginTop: 20}}>
                                <TextInput
                                    label="Email"
                                    value={userName}
                                    onChangeText={setUserName}
                                    returnKeyType="next"
                                    onSubmitEditing={() => inputRef.current?.focus()}
                                />
                                {usernameHelperText && <Text style={{ color: 'red', marginTop: 5 }}>Email can't be empty</Text>}
                            </View>

                            <View style={{flexDirection: "column", marginTop: 20}}>

                                <TouchableOpacity style={ButtonCSS.showPasswordButton}
                                    onPress={() => {
                                        if (ishide == (true)) {
                                            setishide(false)
                                        } else {
                                            setishide(true)
                                        }
                                    }}>
                                    {ishide == true ?
                                    (
                                        <Octicons name="eye" color={COLORS.primaryLightGreyHex} size={30} style={ButtonCSS.showPasswordIcon} />
                                    ) : (
                                        <Octicons name="eye-closed" color={COLORS.primaryLightGreyHex} size={30} style={ButtonCSS.showPasswordIcon} />
                                    )}
                                </TouchableOpacity>
                                <TextInput
                                    secureTextEntry={ishide}
                                    label="Password"
                                    value={password}
                                    returnKeyType="done"
                                    onChangeText={setPassword}
                                    ref={inputRef}
                                />
                                {passwordHelperText && <Text style={{ color: 'red', marginTop: 5 }}>Password can't be empty</Text>}
                            </View>

                            <TouchableOpacity style={LoginManagementCSS.Button} onPress={() => {CallLoginAPI(userName, password)}}>
                                <Text style={LoginManagementCSS.ButtonText}> Login </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </KeyboardAvoidWrapper>
            
            {/* Footer */}
            <View style={[FooterCSS.FooterContainer,]}>
                <Text style={FooterCSS.FooterText}>Version: {appVersion}</Text>
            </View>
        </View>
    );
};

export default LoginScreen;
