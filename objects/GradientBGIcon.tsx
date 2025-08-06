import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../themes/theme';

interface GradientBGIconProps {
    name: string;
    color: string;
    size: number;
}

const GradientBGIcon: React.FC<GradientBGIconProps> = ({name, color, size}) => {
  return (
    <View style={styles.Container}>
        <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            // colors={[COLORS.primaryDarkGreyHex, COLORS.primaryDarkGreyHex]}
            colors={[COLORS.headerColor, COLORS.headerColor]}
            style={styles.LinearGradientBG}>
            <Icon name={name} color={color} size={size} />
        </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
    Container: {
        // borderWidth: 2,
        // borderColor: COLORS.secondaryDarkGreyHex,
        // borderRadius: SPACING.space_12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.secondaryDarkGreyHex,
        overflow: 'hidden',
    },
    LinearGradientBG: {
        height: 36,
        width: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default GradientBGIcon;
