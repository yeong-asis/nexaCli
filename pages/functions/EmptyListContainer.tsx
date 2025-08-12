import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTFAMILY } from '../../themes/theme';

interface EmptyListAnimationProps {
    title: string;
}

const EmptyListContainer: React.FC<EmptyListAnimationProps> = ({title}) => {
    return (
        <View style={styles.EmptyCartContainer}>
            {/* <Image 
            source={require('../../assets/JPBLabel.png')} 
            style={{ 
                width: Dimensions.get("screen").width * 0.6, 
                resizeMode: 'contain', 
                alignSelf: "center",
                marginVertical: 20,
            }} /> */}
        <Text style={styles.LottieText}>{title}</Text>
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
    LottieStyle: {
        height: 300,
        width: 300,
    },
    LottieText: {
        fontSize: 18,
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.secondaryGreyHex,
        padding: 15,
        fontWeight: "bold",
        textAlign: 'center',
    },
});

export default EmptyListContainer;
