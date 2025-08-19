import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTFAMILY } from "../../themes/theme";

interface LoadingAnimationProps {}

const LoadingOverlay: React.FC<LoadingAnimationProps> = () => {
    return (
        <View style={styles.EmptyCartContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.LottieText}>{"Getting Current Location"}</Text>
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
        fontSize: 14,
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.secondaryGreyHex,
        fontWeight: "bold",
        textAlign: 'center',
    },
});

export default LoadingOverlay;