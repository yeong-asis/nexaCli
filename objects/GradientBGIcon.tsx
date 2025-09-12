import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, HEADERBACKGROUNDCOLORCODE } from '../themes/theme';

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
            colors={[COLORS.primaryVeryLightGreyHex, COLORS.primaryVeryLightGreyHex]}
            // colors={[HEADERBACKGROUNDCOLORCODE, HEADERBACKGROUNDCOLORCODE]}
            style={styles.LinearGradientBG}
        >
            <Icon name={name} color={color} size={size} />
        </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: HEADERBACKGROUNDCOLORCODE,
        overflow: 'hidden',
    },
    LinearGradientBG: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default GradientBGIcon;
