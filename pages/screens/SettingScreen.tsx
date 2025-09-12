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

export const SettingScreen = ({navigation}: any) => {
    const [processData, setProcessData] = useState(false);
    const tabBarHeight = useBottomTabBarHeight();

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        setProcessData(true);
        setProcessData(false);
    }

    return (
        <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />
            <HeaderBar title={`${"Settings"}`} checkBackBttn={false} />
            {processData == true ? (
                <View style={{ alignSelf: "center", }}>
                    <LoadingAnimation />
                </View>
            ) : (
            <View style={{width: Dimensions.get("screen").width, height: Dimensions.get("screen").height*0.9, backgroundColor: COLORS.primaryVeryLightGreyHex, paddingTop: 20}}>
                <View style={{ alignSelf: "center", }}>
                    
                </View>
            </View>
            )}
        </View>
    );
}