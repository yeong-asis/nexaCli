import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { Clipboard, Dimensions, Image, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { AddItemScreenCSS, defaultCSS, HeaderCSS, LoginManagementCSS, ProfileCSS } from '../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS } from '../../themes/theme';
import LoadingAnimation from '../functions/LoadingAnimation';
import HeaderBar from '../functions/HeaderBar';
import GradientBGIcon from '../../objects/GradientBGIcon';
import Octicons from 'react-native-vector-icons/Octicons';
import Snackbar from 'react-native-snackbar';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const ProfileScreen = ({navigation}: any) => {
    const [processData, setProcessData] = useState(false);
    const tabBarHeight = useBottomTabBarHeight();
    const [FullName, setFullName] = useState("");
    const [Email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [UserPosition, setUserPosition] = useState("");
    const [ICNumber, setICNumber] = useState("");

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        setProcessData(true);
        
        const checkFullName = await AsyncStorage.getItem('FullName') ?? "";
        const checkEmail = await AsyncStorage.getItem('Email') ?? "";
        const checkToken = await AsyncStorage.getItem('fcmtoken') ?? "";

        try {
            setFullName(checkFullName);
            setEmail(checkEmail);
            setToken(checkToken);
            setProcessData(false);

        }catch (error: any) {
            setProcessData(false);
            console.log("Error: "+error);
        }
    }

    return (
        <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />
            <HeaderBar title={`${"Profile"}`} checkBackBttn={false} />
            {processData == true ? (
                <View style={{ alignSelf: "center", }}>
                    <LoadingAnimation />
                </View>
            ) : (
            <View style={{width: Dimensions.get("screen").width, height: Dimensions.get("screen").height*0.9, backgroundColor: COLORS.primaryVeryLightGreyHex, paddingTop: 20}}>
                <View style={{ alignSelf: "center", }}>
                    <View style={{
                        width: 300,
                        height: 300,
                        borderRadius: 300/2,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 5,     
                        alignSelf: "center", 
                    }}>
                        {/* Person icon in middle */}
                        <Ionicons name="person-outline" size={200} color={COLORS.secondaryLightGreyHex} />
                    </View>

                    <View style={{flexDirection: "column", marginVertical: 40 }}>
                        <Text style={[defaultCSS.TextBold, {}]}> 
                            {FullName}
                        </Text>
                        <Text style={[defaultCSS.TextDescript, {}]}> 
                            {Email}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity style={[AddItemScreenCSS.Button, {width: "40%", marginTop: 20}]} onPress={async () => { 
                    try {
                        // await AsyncStorage.removeItem("UserID");
                        await AsyncStorage.multiRemove([
                            "UserID", 
                            "Department",  
                            "FullName", 
                            "Email"
                        ]);
            
                        navigation.navigate("Login");
                    } catch (error) {
                        console.error("Logout Error:", error);
                    }
                }}>
                    <Text style={[AddItemScreenCSS.ButtonText, {fontSize: 24}]}> Sign Out </Text>
                </TouchableOpacity>
            </View>
            )}
        </View>
    );
}