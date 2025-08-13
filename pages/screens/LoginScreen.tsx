import Octicons from 'react-native-vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { Dimensions, Image, Text, TextInput as TextInputs, TouchableOpacity, View } from 'react-native';
import { Snackbar, TextInput } from 'react-native-paper';
import { COLORS } from '../../themes/theme';
import { LoginManagementCSS, ButtonCSS, defaultCSS, FooterCSS } from '../../themes/CSS';
import KeyboardAvoidWrapper from '../functions/KeyboardAvoidWrapper';
import { IPAddress } from '../../objects/objects';

const LoginScreen = ({navigation}: any) => {
    const [userName, setUserName] = useState('jasonchew@asis-technologies.com');
    const [password, setPassword] = useState('Asis!234');
    const [ishide, setishide] = useState(true);
    const inputRef = React.createRef<TextInputs>();
    const [usernameHelperText, setusernameHelperText] = useState(false);
    const [passwordHelperText, setpasswordHelperText] = useState(false);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const CallLoginAPI = async (username: any, password: any) => {
        let emtpy = false;

        if (username === '') {
            setusernameHelperText(true)
            emtpy = true;
        } else {
            setusernameHelperText(false)
        }

        if (password === '') {
            setpasswordHelperText(true)
            emtpy = true;
        } else {
            setpasswordHelperText(false)
        }

        if (!emtpy) {
            try {
                await axios.get(
                    `${IPAddress}/api/dashboard/login?email=${username}&password=${password}`
                ).then(async response => {
                    
                    const responseData=response.data;

                    // console.log(responseData.isSuccess);
                    if(responseData.isSuccess==true) {
                        setSnackbarMessage('Success');
                        setSnackbarVisible(true);

                        // console.log(responseData.result[0].pkkey);
                        await AsyncStorage.setItem('UserID', responseData.result[0].pkkey);
                        await AsyncStorage.setItem('Department', responseData.result[0].department);
                        await AsyncStorage.setItem('FullName', responseData.result[0].fullName);
                        await AsyncStorage.setItem('Email', responseData.result[0].email);
                        navigation.navigate("Tab", { screen: 'Dashboard'});

                    }else{
                        setSnackbarMessage('Login failed');
                        setSnackbarVisible(true);
                    }
                    // console.log(responseData.result);
                });

                // await AsyncStorage.setItem('UserID', "2");
                // await AsyncStorage.setItem('UserIC', "990524015103");
                // await AsyncStorage.setItem('UserType', "NRIC");
                // await AsyncStorage.setItem('UserPosition', "Driver");
                // await AsyncStorage.setItem('UserLevel', "1");
                // await AsyncStorage.setItem('FullName', "WONG FUH YEONG");
                // await AsyncStorage.setItem('Email', "yeongwf@asis-technologies.com");
                // navigation.navigate("Tab", { screen: 'Dashboard'});

            }catch (error: any) {
                console.log("Error: "+error);
            }
        }
    }

    return (
         <View style={defaultCSS.ScreenContainer}>
            {/* <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} /> */}

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

{                   /* Form Card */}
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
                <Text style={FooterCSS.FooterText}>Version: {"000"}</Text>
            </View>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000} // 3 seconds
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
};

export default LoginScreen;
