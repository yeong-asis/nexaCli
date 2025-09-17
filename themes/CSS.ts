import { Dimensions, Platform, StyleSheet } from "react-native";
import { BLACKUSEFULCOLOR, COLORS, FONTFAMILY, HEADERBACKGROUNDCOLORCODE, MAINCOLOR, SECONDGREENCOLOR } from "./theme";

export const defaultCSS = StyleSheet.create({
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.secondaryVeryLightGreyHex,
    },
    ScrollViewFlex: {
        flexGrow: 1,
    },
    ScrollViewContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    SettheKeyboardView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    LineContainer: {
        height: 0.4, 
        width: '100%', 
        backgroundColor: COLORS.primaryLightGreyHex, 
        marginBottom: 10,
    },
    CardShadow: {
        // flex: 1,
        width: "100%",
        borderRadius: 44,
        backgroundColor: 'transparent',
        shadowColor: COLORS.primaryBlackHex,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 10,
    },
    CardContainer: {
        alignSelf: "center",
        backgroundColor: COLORS.primaryWhiteHex,
        borderRadius: 16,
        overflow: 'hidden',
        marginVertical: 30,
        width: Dimensions.get("screen").width*0.9,
    },
    CardContainerTitle: {
        flexDirection: "row", 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginVertical: 10, 
        marginHorizontal: 15,
    },
    TitleContainer: {
        flexDirection: "row", 
        paddingHorizontal: 20,
    },
    MainTitle: {
        fontSize: 24,
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryLightGreyHex,
        paddingLeft: 10,
        fontWeight: "bold",
    },
    ScreenTitle: {
        fontSize: 20,
        fontFamily: FONTFAMILY.poppins_medium,
        // color: COLORS.primaryGreyHex,
        color: COLORS.primaryLightGreyHex,
        fontWeight: "bold",
        marginTop: 20,
    },
    DashboardContainer: {
        alignItems: "center", 
        backgroundColor: HEADERBACKGROUNDCOLORCODE,
        borderTopLeftRadius: 55, 
        borderTopRightRadius: 55, 
    },
    DashboardSubContainer: {
        alignItems: "center", 
        borderTopLeftRadius: 55, 
        borderTopRightRadius: 55, 
    },
    TextLabel: {
        fontSize: 14,
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryWhiteHex,
        fontWeight: "bold",
    },
    TextInputContainer: {
        flex: 1,
        height: 60,
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: 18,
        textAlign: "center",
        color: COLORS.primaryGreyHex,
        borderColor: COLORS.primaryGreyHex,
        borderWidth: 0.4,
        borderRadius: 10,
        margin: 5
    },
    TextInputFont: {
        color: COLORS.primaryDarkGreyHex,  
        paddingLeft: 5, 
        fontSize: 16, 
        fontWeight: "bold",
        fontFamily: FONTFAMILY.poppins_medium,
    },
    TextInput: {
        alignSelf:"center",
        width:"100%",
    },
    H1: {
        fontSize: 20,
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryDarkGreyHex,
        fontWeight: "bold",
    },
    Text: {
        fontSize: 16,
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryLightGreyHex,
    },
    TextBold: {
        fontSize: 24,
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryDarkGreyHex,
        fontWeight: "bold",
        alignSelf: "center",
    },
    TextDescript: {
        fontSize: 18,
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryDarkGreyHex,
        fontWeight: "bold",
        alignSelf: "center",
        marginTop: 5,
    },
    DetailViewContainer: {
        width: "80%", 
        marginVertical: 10, 
        // alignItems: "center",
    },
    ListSelectionCSS: {
        padding: 24,
        marginBottom: 12,
        borderRadius: 10,
        backgroundColor: COLORS.primaryWhiteHex,
        shadowColor: COLORS.primaryBlackHex,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 10,
    },
    ListTextCSS: {
        color: COLORS.primaryGreyHex,
        fontSize: 18, 
        fontWeight: 'bold',
        fontFamily: FONTFAMILY.poppins_medium,
    },
    starTextInput: {
        color: 'red', 
        // right: 10, 
        // top: 5, 
        fontSize: 16, 
        // position: "absolute",
    },
    loadingScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    }
});

export const LoginManagementCSS = StyleSheet.create({
    widthAndAdjustment: {
        width: "90%", 
        // height: 200,
        alignSelf: "center",
    },
    CardShadow: {
        borderRadius: 16,
        backgroundColor: 'transparent',
        shadowColor: COLORS.primaryBlackHex,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 10,
    },
    CardContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryWhiteHex,
        height: Dimensions.get("screen").height*0.45,
        borderRadius: 6,
        overflow: 'hidden',
    },
    TextTitleFont: {
        color: COLORS.primaryDarkGreyHex,  
        fontSize: 28, 
        fontWeight: "bold",
        fontFamily: FONTFAMILY.poppins_medium,
        textAlign: "center"
    },
    TextInputDesign: {
        backgroundColor: COLORS.primaryWhiteHex, 
        borderWidth: 0.4,
        width: "80%",
        height: 50,
        alignSelf: "center",
    },
    TextInputFont: {
        color: COLORS.primaryDarkGreyHex,
        fontSize: 14, 
        fontWeight: "bold",
        fontFamily: FONTFAMILY.poppins_medium,
        textAlign: "center"
    },
    Button: {
        alignSelf:"center",
        backgroundColor:HEADERBACKGROUNDCOLORCODE,
        width:"40%",
        justifyContent:"center",
        marginTop: 20,
        borderRadius: 20,
        height: 60,
    },
    ButtonText: {
        fontWeight: "bold",
        fontSize: 18,
        fontFamily: FONTFAMILY.poppins_medium,
        alignSelf: "center",
        color: COLORS.primaryWhiteHex,
    },
    HelperCSS: {
        width: "80%", 
        marginTop: 5, 
        alignSelf: "center",
    },
    showPasswordButton: {
        position: "absolute", 
        alignSelf: "flex-end", 
        margin: 6, 
        zIndex: 10, 
        paddingRight: 50,
    },
    showPasswordIcon: {
        color:COLORS.primaryGreyHex, 
        marginTop: 5,
    },
});

export const HeaderCSS = StyleSheet.create({
    SetHeaderCSS: {
        // marginTop: Platform.OS === 'android' ? -40 : 0,
    },
    FirstTopMainHeaderCSS: {
        flexDirection: "row", 
        width: Dimensions.get("screen").width, 
        justifyContent: "space-between", 
        backgroundColor: BLACKUSEFULCOLOR,
    },
    HeaderPictureCSS: {
        width: 100, 
        height: 30,
        resizeMode: 'contain', 
        alignSelf: "center",
        marginTop: 40,
        marginLeft: 20,
        marginBottom: 15,
    },
    HeaderIconCSS: {
        marginTop: 40,
        marginRight: 20,
        marginBottom: 15,
    },
    HeaderContainer: {
        width: Dimensions.get("screen").width,
        backgroundColor: COLORS.primaryVeryLightGreyHex,
        padding: 10,
        paddingTop: 15,
    },
    BackHeaderContainer: {
        width: Dimensions.get("screen").width,
        backgroundColor: COLORS.primaryVeryLightGreyHex,
        padding: 12,
        paddingTop: 10,
        flexDirection: 'row',
        alignSelf: "center",
    },
    HeaderText: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: 28,
        color: HEADERBACKGROUNDCOLORCODE,
        fontWeight: "bold",
        alignSelf: "center"
    },
    iconWithBadge: {
        position: 'relative',
        marginRight: 10,
    },
    tickIconContainer: {
        position: 'absolute',
        right: 0,
        top: -2,
        borderRadius: 10,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    MenuIcon: {
        marginHorizontal: 10,
        alignSelf: "center",
        color: "white",
    },
});

export const FooterCSS = StyleSheet.create({
    FooterContainer: {
        padding: 10, 
        alignItems: 'flex-end',
        marginBottom: 30,
    },
    FooterText: {
        color: COLORS.secondaryLightGreyHex,
        alignSelf: "center",
    },
});

export const AddItemScreenCSS = StyleSheet.create({
    TextInputIOSCSS: {
        marginLeft: 0,
    },
    TextTitleFont: {
        color: COLORS.primaryDarkGreyHex,  
        paddingLeft: 5, 
        fontSize: 14, 
        fontWeight: "bold",
        fontFamily: FONTFAMILY.poppins_medium,
    },
    TextInputFont: {
        color: COLORS.primaryDarkGreyHex,  
        paddingLeft: 5, 
        fontSize: 14, 
        fontWeight: "bold",
        fontFamily: FONTFAMILY.poppins_medium,
    },
    labelRow: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    asterisk: {
        color: "red",
        marginLeft: 4,
        fontSize: 16,
        fontFamily: FONTFAMILY.poppins_medium,
    },
    errorText: {
        color: "red",
        marginTop: 4,
        fontSize: 12,
        fontFamily: FONTFAMILY.poppins_medium,
    },
    Button: {
        alignSelf:"center",
        backgroundColor:HEADERBACKGROUNDCOLORCODE,
        width:"60%",
        // width:"31%",
        justifyContent:"center",
        borderRadius: 8,
        height: 50,
        marginVertical: 5,
    },
    ButtonText: {
        fontWeight: "bold",
        fontSize: 18,
        fontFamily: FONTFAMILY.poppins_medium,
        alignSelf: "center",
        color: COLORS.primaryWhiteHex,
    },
    CheckboxCSS: {
        borderWidth: Platform.OS == "ios" ? 1 : 0,
        borderColor: '#AAA',
        borderRadius: 4,
    },
    AddItemBtn: {
        alignSelf: "flex-end",
        backgroundColor: COLORS.secondaryGreenHex,
        width: "auto",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 40,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
    },
    AddItemText: {
        fontWeight: "bold",
        fontSize: 14,
        fontFamily: FONTFAMILY.poppins_medium,
        alignSelf: "center",
        color: COLORS.primaryWhiteHex,
    },
    NormalTextInput: {
        height: 50,
        backgroundColor: COLORS.primaryWhiteHex,
    },
    TextArea: {
        backgroundColor: COLORS.primaryWhiteHex,
        paddingVertical: 10,
    },
    dropdown: {
        height: 50,
        backgroundColor: COLORS.primaryWhiteHex,
        borderColor: COLORS.primaryLightGreyHex,
        borderWidth: 0.4,
        borderRadius: 6,
        paddingHorizontal: 8,
    },
    placeholderStyle: {
        fontSize: 14,
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryLightGreyHex,
    },
    listContainerStyle: {
        backgroundColor: COLORS.primaryWhiteHex,
    },
    selectedTextStyle: {
        fontSize: 14,
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryDarkGreyHex,
        
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryDarkGreyHex,
    },
    ReplyCommentCSS: {
        flexDirection: "column",
        backgroundColor: '#f0f0f0', 
        padding: 8, 
        borderLeftWidth: 3, 
        borderLeftColor: '#4CAF50', 
        marginBottom: 5,
        borderRadius: 5 
    },
    RadioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    RadioRow: {
        height: 14,
        width: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: HEADERBACKGROUNDCOLORCODE,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        marginVertical: 5,
    },
    RadioText: {
        fontWeight: "bold",
        fontSize: 12,
        fontFamily: FONTFAMILY.poppins_medium,
    },
});

export const SignatureCSS = `   
    .m-signature-pad {
        height: 100%; 
    } 
    .m-signature-pad--footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        padding: 10px;
        background-color: #f0f0f0;
    }
    .m-signature-pad--footer .button {
        background-color: #007AFF;
        color: white;
        border-radius: 6px;
        font-size: 16px;
        fontFamily: FONTFAMILY.poppins_medium,
        border: none;
    }
    .m-signature-pad--footer .button.clear {
        background-color:rgb(177, 9, 0);
    }
    .m-signature-pad--footer .button.save {
        background-color:rgb(0, 101, 25);
    }
`;


export const ButtonCSS = StyleSheet.create({
    ButtonContainer: {
        alignSelf:"center",
        width:"60%",
        justifyContent:"center",
        marginBottom: 10,
        borderRadius: 20,
        height: 60,
        backgroundColor: HEADERBACKGROUNDCOLORCODE, 
    },
    ButtonTextCSS: {
        fontWeight: "bold",
        fontSize: 20,
        fontFamily: FONTFAMILY.poppins_medium,
        alignSelf: "center",
        color: COLORS.primaryWhiteHex,
    },
    MainButtonContainer: {
        alignSelf:"center",
        backgroundColor:HEADERBACKGROUNDCOLORCODE,
        width:"70%",
        justifyContent:"center",
        marginBottom: 20,
        borderRadius: 20,
        height: 70,
    },
    MainButtonTextCSS: {
        fontWeight: "bold",
        fontSize: 24,
        fontFamily: FONTFAMILY.poppins_medium,
        alignSelf: "center",
        color: COLORS.primaryWhiteHex,
    },
    ScanButtonCard: {
        alignSelf:"center",
        // backgroundColor:COLORS.primaryLightGreyHex,
        width: 110,
        justifyContent:"center",
        borderRadius: 20,
        height: 110,
    },
    ScanButtonContainer: {
        alignSelf:"center",
        backgroundColor:MAINCOLOR,
        width:"90%",
        justifyContent:"center",
        marginBottom: 15,
        borderRadius: 20,
        height: 110,
    },
    ContactContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    ContactIconButton: {
        backgroundColor:MAINCOLOR,
        borderRadius: 30, 
        width: 60, 
        height: 60, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    SegmentedContainer: {
        flexDirection: "row", 
        alignSelf: "center", 
        justifyContent: "center", 
        width: Dimensions.get("screen").width*0.8, 
    },
    SegmentedButton: {
        paddingVertical: 10,
        width: 100,
        alignItems: "center",
        // padding: 10,
        // width: 100,
        // borderWidth: 0.4,
    },
    SegmentedText: {
        textAlign: "center",
        color: COLORS.primaryGreyHex,
        fontSize: 14,
        fontFamily: FONTFAMILY.poppins_medium,
        fontWeight: "bold",
    },
    plusButton: {
        position: 'absolute',
        bottom: 40,
        right: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: HEADERBACKGROUNDCOLORCODE, // adjust to your brand color
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // drop shadow on Android
        shadowColor: '#000', // drop shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },
});

export const IconListPicture = StyleSheet.create({
    IconList: {
        marginHorizontal: "auto",
        width: Dimensions.get("screen").width,
        flexDirection: "row",
        flexWrap: "wrap",
        margin: 10,
        justifyContent: 'center',
    },
    gridCSS: {
        flex: 1,
        minWidth: 150,
        maxWidth: 150,
        height: 150,
        justifyContent: "center",
        alignItems: "center",
        margin: 15,
        backgroundColor: COLORS.secondaryVeryLightGreyHex,
        borderWidth: 1,
        borderColor: COLORS.secondaryLightGreyHex,
        borderRadius: 8,
    },
    gridTitle: {
        textAlign: "center", 
        justifyContent: "center", 
        color: COLORS.primaryGreyHex,
        fontSize: 16,
        fontFamily: FONTFAMILY.poppins_medium,
        fontWeight: "bold",
    },
});

export const ModalCSS = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: COLORS.primaryWhiteHex,
        padding: 32,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        minWidth: 300,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: FONTFAMILY.poppins_medium,
        marginBottom: 10,
        color: COLORS.primaryBlackHex,
    },
    modalMessage: {
        marginBottom: 5,
        textAlign: 'center',
        color: COLORS.primaryBlackHex,
    },
});

export const datepickerCSS = StyleSheet.create({
    datePicker: {
        height: 120,
        width: 200,
        marginTop: -10,
    },
    textInput: {
        color: COLORS.primaryDarkGreyHex,
        textAlign: "center",
        fontSize: 14,
        fontFamily: FONTFAMILY.poppins_medium,
        height: 60,
        width: Dimensions.get("screen").width/100*70,
        backgroundColor: "white"
    },
    pressableCSS: {
        color: COLORS.primaryBlackHex,
        backgroundColor: COLORS.primaryWhiteHex,
        borderColor: '#ccc',
        borderRadius: 8,
        height: 60,
        width: Dimensions.get("screen").width/100*70,
        fontSize: 10,
        fontFamily: FONTFAMILY.poppins_medium,
    },
});

export const TabCSS = StyleSheet.create({
    tabBarStyle: {
        height: 60,
        position: 'absolute',
        backgroundColor: SECONDGREENCOLOR,
        // backgroundColor: COLORS.primaryWhiteHex,
        borderTopWidth: 0,
        elevation: 0,
        borderTopColor: 'transparent',
        paddingTop: 10,
    },
    BlurViewStyles: {
        // position: 'absolute',
        // top: 0,
        // bottom: 0,
        // left: 0,
        // right: 0,
    },
});

export const ProfileCSS = StyleSheet.create({
    mainContainerList: {
    },
    ButtonContainer: {
        flexDirection: "row",
        alignSelf:"center",
        // justifyContent:"center",
        borderRadius: 20,
        height: Dimensions.get("screen").height*0.1,
        width: Dimensions.get("screen").width*0.8,
    },
    ButtonTextCSS: {
        fontWeight: "bold",
        fontSize: 18,
        fontFamily: FONTFAMILY.poppins_medium,
        alignSelf: "center",
        // color: COLORS.primaryWhiteHex,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: COLORS.primaryWhiteHex,
        justifyContent: "center",
        alignSelf: "center",
        marginRight: 20,
        // borderWidth: 1,
    },
    iconText: {
        textAlign: "center",
    },
    LineList: {
        height: 0.4, 
        width: '100%', 
        backgroundColor: COLORS.primaryLightGreyHex, 
    },
});