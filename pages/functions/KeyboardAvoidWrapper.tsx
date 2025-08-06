import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { defaultCSS } from "../../themes/CSS";

const KeyboardAvoidWrapper: React.FC<IProps> = ({ children }) => {
    return (
        <KeyboardAvoidingView
            style={styles.settheKeyboardView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={defaultCSS.ScrollViewFlex}>
                <View>{children}</View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    settheKeyboardView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    setScrollView: {
        flex: 1,
    }
})

export default KeyboardAvoidWrapper;

export interface IProps {
    children: React.ReactNode;
}
