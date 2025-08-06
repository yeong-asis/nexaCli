import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { Dimensions, Image, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SampleBase64Image } from '../../objects/SampleJsonData';
import { defaultCSS, HeaderCSS, LoginManagementCSS, ProfileCSS } from '../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS } from '../../themes/theme';
import LoadingAnimation from '../functions/LoadingAnimation';
import HeaderBar from '../functions/HeaderBar';
import GradientBGIcon from '../../objects/GradientBGIcon';
import Octicons from 'react-native-vector-icons/Octicons';

export const ProfileScreen = ({navigation}: any) => {
    const [processData, setProcessData] = useState(false);
    const [FullName, setFullName] = useState("");
    const [Email, setEmail] = useState("");
    const [UserPosition, setUserPosition] = useState("");
    const [ICNumber, setICNumber] = useState("");
    const [FacePicBase64, setFacePicBase64] = useState("");

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        setProcessData(true);
        
        const checkFullName = await AsyncStorage.getItem('FullName') ?? "";
        const checkEmail = await AsyncStorage.getItem('Email') ?? "";

        try {
            setFacePicBase64(SampleBase64Image);
            setFullName(checkFullName);
            setEmail(checkEmail);
            setProcessData(false);

        }catch (error: any) {
            setProcessData(false);
            console.log("Error: "+error);
        }
    }

    return (
        <SafeAreaView style={[defaultCSS.ScreenContainer, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />

            {processData == true ? (
                <View style={{ alignSelf: "center", }}>
                    <LoadingAnimation />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={HeaderCSS.SetHeaderCSS}>
                        <HeaderBar title={`Profile: `} checkBackBttn={false} />
                    </View>
                    <View style={{alignItems: "center",}}>
                        <View style={{
                            padding: 30,
                            marginVertical: 5,
                        }}>
                            <Image 
                                style={{
                                    height: 150, 
                                    width: 150, 
                                    borderRadius: 80,
                                    resizeMode: 'cover',
                                    // resizeMode: 'contain',
                                    alignSelf: "center",
                                }} 
                                source={require('../../assets/personIcon.png')}
                                // source={FacePicBase64 ? {uri: "data:application/octet-stream;base64,"+FacePicBase64}: require('../../assets/personIcon.png')}
                            />
                        </View>

                        <View style={{flexDirection: "column", width: Dimensions.get("screen").width*0.8,}}>
                            <Text style={[defaultCSS.TextBold, {  }]}> 
                                {FullName}
                            </Text>
                            <Text style={[defaultCSS.TextBold, { fontSize: 14, color: COLORS.secondaryLightGreyHex}]}> 
                                {Email}
                            </Text>
                        </View>
                    </View>

                    <View style={[LoginManagementCSS.widthAndAdjustment, LoginManagementCSS.CardShadow, {marginTop: 50}]}>
                        <View style={[{
                            backgroundColor: COLORS.primaryWhiteHex,
                            borderRadius: 16,
                            overflow: 'hidden',
                        }]}>
                            <View style={ProfileCSS.mainContainerList}>
                                <TouchableOpacity style={ProfileCSS.ButtonContainer} onPress={async () => {}}>
                                    <View style={ProfileCSS.iconCircle}>
                                        {/* <GradientBGIcon name={"info"} size={40} color={COLORS.primaryDarkGreyHex} /> */}
                                        <Octicons name="eye" color={COLORS.primaryDarkGreyHex} size={40} style={ProfileCSS.iconText}  />
                                    </View>
                                    <Text style={ProfileCSS.ButtonTextCSS}> {"More Info"}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={ProfileCSS.LineList}></View>

                            <View style={ProfileCSS.mainContainerList}>
                                <TouchableOpacity style={ProfileCSS.ButtonContainer} onPress={async () => {}}>
                                    <View style={ProfileCSS.iconCircle}>
                                        {/* <GradientBGIcon name={"settings"} size={40} color={COLORS.primaryDarkGreyHex} /> */}
                                        <Octicons name="eye" color={COLORS.primaryDarkGreyHex} size={40} style={ProfileCSS.iconText}  />
                                    </View>
                                    <Text style={ProfileCSS.ButtonTextCSS}> {"Settings"}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={ProfileCSS.LineList}></View>

                            <View style={{
                                // backgroundColor: COLORS.primaryRedHex, 
                                width: "100%"
                            }}>
                                <TouchableOpacity style={[ProfileCSS.ButtonContainer, {}]} onPress={async () => {
                                    try {
                                        await AsyncStorage.multiRemove([
                                            "UserIC", 
                                            "UserID", 
                                            "UserPosition", 
                                            "UserLevel", 
                                            "FullName", 
                                            "FacePicture", 
                                            "UserType"
                                        ]);
                            
                                        navigation.navigate("Login");
                                    } catch (error) {
                                        console.error("Logout Error:", error);
                                    }
                                }}>
                                    <View style={[ProfileCSS.iconCircle, {
                                        // backgroundColor: COLORS.primaryRedHex
                                    }]}>
                                        {/* <GradientBGIcon name={"log-out"} size={40} color={COLORS.primaryDarkGreyHex} /> */}
                                        <Octicons name="eye" color={COLORS.primaryDarkGreyHex} size={40} style={ProfileCSS.iconText}  />
                                    </View>
                                    <Text style={[ProfileCSS.ButtonTextCSS, {color: COLORS.primaryDarkGreyHex}]}> {"Logout"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}