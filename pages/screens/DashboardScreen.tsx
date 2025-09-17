import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { defaultCSS, IconListPicture } from '../../themes/CSS';
import { COLORS } from '../../themes/theme';
import { GridItem } from '../functions/GridItem';
import { UserPageList } from '../functions/UserPageList';
import HeaderBar from '../functions/HeaderBar';

export const DashboardScreen = ({navigation}: any) => {
    const tabBarHeight = useBottomTabBarHeight();
    const [processData, setProcessData] = useState(false);

    const [FullName, setFullName] = useState("");
    const [Email, setEmail] = useState("");
    const [UserID, setUserID] = useState("");
    const [FCMToken, setFCMToken] = useState("");

    useEffect(() => {
        (async () => {
            await CheckUserPosition();
        })();
    }, []);

    

    const CheckUserPosition = async () => {
        setProcessData(true);
        const checkUserFullName = await AsyncStorage.getItem('FullName') ?? "";
        const checkUserEmail = await AsyncStorage.getItem('Email') ?? "";
        const checkUserID = await AsyncStorage.getItem('UserID') ?? "";
        const fcmtoken = await AsyncStorage.getItem('fcmtoken') ?? "";

        setFullName(checkUserFullName);
        setEmail(checkUserEmail);
        setUserID(checkUserID);
        setFCMToken(fcmtoken);

        setProcessData(false);
    }

    return (
        <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            <HeaderBar title={`${"Menu"}`} checkBackBttn={false} />
            {processData ? (
                <View style={{ flex: 1, marginVertical: Dimensions.get('screen').height / 100 * 10 }}>
                    <ActivityIndicator size={40} color="#000000" />
                </View>
            ): (
                <View style={{marginBottom: tabBarHeight}}>
                    <View style={{width: Dimensions.get("screen").width, height: Dimensions.get("screen").height}}>

                        {/* Menu Flatlist Container */}
                        <View style={[defaultCSS.DashboardContainer, {flex: 1,}]}>

                            <View style={{flex: 1, width: "100%", backgroundColor: COLORS.primaryVeryLightGreyHex,}}>
                                <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={defaultCSS.ScrollViewFlex}>
                                    <View style={[IconListPicture.IconList]}>
                                        { UserPageList.slice(0, 10).map((item) => (
                                            <TouchableOpacity 
                                            key={item.id}
                                            onPress={() => {
                                                if(item.navigate!=""){
                                                    navigation.navigate(item.navigate);
                                                }else{
                                                    console.log("empty navigation")
                                                }
                                            }} >
                                                <GridItem icon={item.icon} title={item.title ?? ""} />
                                            </TouchableOpacity>
                                        )) }
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};
