import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTFAMILY } from '../../themes/theme';

interface LoadingAnimationProps {}

const LoadingAnimation: React.FC<LoadingAnimationProps> = () => {
    return (
        <View style={styles.EmptyCartContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.LottieText}>{"Loading..."}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    EmptyCartContainer: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "center",
        marginVertical: 30,
    },
    LottieText: {
        fontSize: 20,
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.secondaryGreyHex,
        fontWeight: "bold",
        textAlign: 'center',
    },
});

export default LoadingAnimation;
