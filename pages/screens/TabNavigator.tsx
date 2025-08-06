import React, { useEffect } from 'react';
import {BackHandler, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BlurView} from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../themes/theme';
import { TabCSS } from '../../themes/CSS';
import { DashboardScreen } from './DashboardScreen';
import { ProfileScreen } from './ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: TabCSS.tabBarStyle,
            tabBarBackground: () => (
                <BlurView
                    overlayColor=""
                    blurAmount={10}
                    style={TabCSS.BlurViewStyles}
                />
            ),
        }}>
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ tabBarIcon: ({focused, color, size}) => (
                    <Icon
                        name="home"
                        size={28}
                        color={
                            focused ? COLORS.primaryWhiteHex : COLORS.secondaryLightGreyHex
                        }
                    />
                ), }}>
            </Tab.Screen>
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ tabBarIcon: ({focused, color, size}) => (
                    <Icon
                        name="person"
                        size={28}
                        color={
                            focused ? COLORS.primaryWhiteHex : COLORS.secondaryLightGreyHex
                        }
                    />
                ), }}>
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default TabNavigator;
