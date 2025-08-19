import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Platform, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { defaultCSS, IconListPicture } from '../../themes/CSS';
import { COLORS } from '../../themes/theme';
import { GridItem } from '../functions/GridItem';
import { UserPageList } from '../functions/UserPageList';

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
        <SafeAreaView style={[defaultCSS.ScreenContainer, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            <StatusBar backgroundColor={COLORS.secondaryLightGreyHex} />
            {processData ? (
                <View style={{ flex: 1, marginVertical: Dimensions.get('screen').height / 100 * 10 }}>
                    <ActivityIndicator size={40} color="#000000" />
                </View>
            ): (
                <View style={{marginBottom: tabBarHeight}}>
                    <View style={{width: Dimensions.get("screen").width, height: Dimensions.get("screen").height}}>
                        {/* Logo & Title Container */}
                        <View style={[{flex: 0.2, alignItems: "center"}]}>
                            <Image 
                            source={require('../../assets/asislogo.png')} 
                            style={{ 
                                width: Dimensions.get("screen").width*0.7, 
                                resizeMode: 'contain', 
                                alignSelf: "center",
                                // marginTop: 60,
                            }} />
                            <View style={[defaultCSS.TitleContainer]}>
                                <Text style={[defaultCSS.ScreenTitle]}>
                                    Welcome To ASIS Technologies
                                </Text>
                            </View>
                        </View>

                        {/* Menu Flatlist Container */}
                        <View style={[defaultCSS.DashboardContainer, {flex: 0.8,}]}>
                            <View style={{flexDirection: "row", flex: 0.12, width: "70%", justifyContent: "space-between", marginTop: 20}}>
                                <View style={{flexDirection: "column", width: "15%"}}>
                                    <Text style={defaultCSS.TextLabel}>User:</Text>
                                    <Text style={defaultCSS.TextLabel}>Test:</Text>
                                    {/* <Text style={defaultCSS.TextLabel}>Email</Text> */}
                                </View>
                                <View style={{flexDirection: "column", width: "75%",}}>
                                    {/* <Text style={defaultCSS.TextLabel}>Title:</Text>
                                    <Text style={defaultCSS.TextLabel}>{userPosition}</Text> */}
                                    <Text style={defaultCSS.TextLabel}>{FullName}</Text>
                                    <Text style={defaultCSS.TextLabel}>{UserID}</Text>
                                    {/* <Text style={defaultCSS.TextLabel}>{Email}</Text> */}
                                </View>
                            </View>
                            <View style={[defaultCSS.DashboardSubContainer, {flex: 0.88, width: "100%", backgroundColor: COLORS.primaryWhiteHex,}]}>
                                <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={defaultCSS.ScrollViewFlex}>
                                    <View style={IconListPicture.IconList}>
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
        </SafeAreaView>
    );
};
