import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Asset, ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { Checkbox, Menu, TextInput } from "react-native-paper";
import { AddItemScreenCSS, ButtonCSS, defaultCSS, LoginManagementCSS } from '../../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS, HEADERBACKGROUNDCOLORCODE } from '../../../themes/theme';
import HeaderBar from '../../functions/HeaderBar';
import axios from 'axios';
import { IPAddress, SelectionItem } from '../../../objects/objects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import LoadingAnimation from '../../functions/LoadingAnimation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type ProductItem = {
    id: string;
    name: string;
    quantity: string;
    notes: string;
    unitPrice: string;
    discount: string;
};

const AddStockScreen = ({ navigation }: { navigation: any }) => {
    const [processData, setProcessData] = useState(false);
    const [selectedType, setSelectedType] = useState("General");

    const [requester, setRequester] = useState("");
    const [requesterName, setRequesterName] = useState("");
    const [requesterOptions, setRequesterOptions] = useState<SelectionItem[]>([]);

    const [category, setCategory] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [categoryOptions, setCategoryOptions] = useState<SelectionItem[]>([]);

    const [deliverTo, setDeliverTo] = useState('');
    const [deliverToName, setDeliverToName] = useState('');
    const [deliverToOptions, setDeliverToOptions] = useState<SelectionItem[]>([]);

    const [receiveFrom, setReceiveFrom] = useState('');
    const [receiveFromName, setReceiveFromName] = useState('');
    const [receiveFromOptions, setReceiveFromOptions] = useState<SelectionItem[]>([]);

    const [movementType, setMovementType] = useState('1');
    const [movementTypeName, setMovementTypeName] = useState('IN');
    const movementTypeOptions = [{'pkkey':'1', 'name':'IN'}, {'pkkey':'2', 'name':'OUT'}];

    const [purpose, setPurpose] = useState("");
    const [remark, setRemark] = useState("");
    const [attachments, setAttachments] = useState<any[]>([]);

    // Products Part
    const [products, setProducts] = useState<ProductItem[]>([ { id: '', name: '', quantity: '', notes: '', unitPrice: "", discount: "" }, ]);
    const [productOptions, setProductOption] = useState<SelectionItem[]>([]);

    const [focusedDropdownIndex, setFocusedDropdownIndex] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            await fetchedSelectionAPI();
        })();
    }, []);

    const pickFiles = async () => {
        try {
            const options: ImageLibraryOptions = {
                mediaType: 'mixed', // 'photo' | 'video' | 'mixed'
                selectionLimit: 0,  // 0 means unlimited selection
                includeBase64: false, // Optional: if you need base64 data
            };

            launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled picker');
                } else if (response.errorCode) {
                    console.error('ImagePicker Error: ', response.errorMessage);
                } else {
                    const picked: Asset[] = response.assets ?? [];
                    setAttachments((prev) => [...prev, ...picked]);
                }
            });
        } catch (err) {
            console.error(err);
        }
    };

    const fetchedSelectionAPI = async() => {
        setProcessData(true);

        const getUserID = await AsyncStorage.getItem('UserID') ?? "";
        setRequester(getUserID);
        const getUserEmail = await AsyncStorage.getItem('Email') ?? "";
        const getUserPassword = await AsyncStorage.getItem('Password') ?? "";

        try {
            const response = await axios.post(
                "http://192.168.168.150/NEXA/api/StockMovement/Get",
                {
                    "APIAction": "GetPreloadData"
                },
                {
                    auth: {
                        username: getUserEmail,
                        password: getUserPassword
                    }
                }
            );

            const responseData=response.data;
            if(responseData.Acknowledge==0) {

                const getRequesters=responseData.Requesters;
                const requesterOptions: SelectionItem[] = getRequesters.map((item: any) => ({
                    pkkey: String(item.Id),
                    name: item.Name,
                }));
                setRequesterOptions(requesterOptions);
                const user = responseData.Requesters.find((u: any) => u.Id === getUserID);
                setRequesterName(user?.fullName ?? '');

                const getCategory=responseData.Categories;
                const categoryOptions: SelectionItem[] = getCategory.map((item: any) => ({
                    pkkey: String(item.Id),
                    name: item.Name,
                }));
                setCategoryOptions(categoryOptions);

                const getReceiveFrom=responseData.ReceiveFrom;
                const receiveFromOptions: SelectionItem[] = getReceiveFrom.map((item: any) => ({
                    pkkey: String(item.DEARID),
                    name: item.Name,
                }));
                setReceiveFromOptions(receiveFromOptions);

                const getDeliverTo=responseData.DeliverTo;
                const deliverToOptions: SelectionItem[] = getDeliverTo.map((item: any) => ({
                    pkkey: String(item.DEARID),
                    name: item.Name,
                }));
                setDeliverToOptions(deliverToOptions);

                const getProducts=responseData.Products;
                const productsOptions: SelectionItem[] = getProducts.map((item: any) => ({
                    pkkey: String(item.DEARID),
                    name: item.Name,
                    notes: item.Notes == null ? "" : item.Notes,
                    unitPrice: item.UnitPrice,
                    discount: item.Discount,
                }));
                setProductOption(productsOptions);

                setProcessData(false);
            }else{
                Snackbar.show({
                    text: 'Connect Server failed, Please try again.',
                    duration: Snackbar.LENGTH_LONG,
                });
                setProcessData(false);
            }

        }catch (error: any) {
            setProcessData(false);
            console.log("Error: "+error);
        }
    };

    const submitAddStock = async (
        requestID: any, 
        category: any,
        movementType: any,
        receiveFrom: any,
        deliverTo: any,
        purpose: any,
        remark: any,
        products: any,
        attachments: any
    ) => {
        setProcessData(true);
        let emtpy = false;

        if (category === '') {
            Snackbar.show({
                text: 'Category can not be empty',
                duration: Snackbar.LENGTH_LONG,
            });
            emtpy = true;
            setProcessData(false);
        }

        if (receiveFrom === '') {
            Snackbar.show({
                text: 'Receive From can not be empty',
                duration: Snackbar.LENGTH_LONG,
            });
            emtpy = true;
            setProcessData(false);
        }

        if (deliverTo === '') {
            Snackbar.show({
                text: 'Deliver to can not be empty',
                duration: Snackbar.LENGTH_LONG,
            });
            emtpy = true;
            setProcessData(false);
        }

        if (products.length<=1 && products[0].id=="") {
            Snackbar.show({
                text: 'Please choose at least one product',
                duration: Snackbar.LENGTH_LONG,
            });
            emtpy = true;
            setProcessData(false);
        }else if (products.length<=1 && products[0].quantity=="") {
            Snackbar.show({
                text: 'Quantity can not be zero',
                duration: Snackbar.LENGTH_LONG,
            });
            emtpy = true;
            setProcessData(false);
        }

        if (!emtpy) {
            const getUserEmail = await AsyncStorage.getItem('Email') ?? "";
            const getUserPassword = await AsyncStorage.getItem('Password') ?? "";
            const todayDate = new Date().toISOString();

            try {
                const formattedProducts = products.map((p: any) => ({
                    DEARID: p.id,
                    Notes: p.notes || "",
                    Quantity: Number(p.quantity) || 0,
                    UnitPrice: Number(p.unitPrice) || 0,
                    Discount: Number(p.discount) || 0,
                    Amount: (Number(p.quantity) || 0) * (Number(p.unitPrice) || 0)
                }));

                const request = {
                    "APIAction": "AddSMQ",
                    "SMQ": {
                        "RequesterID": Number(requestID),
                        "Category": Number(category),
                        "MovementType": Number(movementType),
                        "ReceiveFrom": receiveFrom,
                        "DeliverTo": deliverTo,
                        "Purpose": purpose,
                        "PTRID": 0,
                        "PMXID": 0,
                        "SO": "",
                        "RMA": "",
                        "ReceiverSignature": "",
                        "DelivererSignature": "",
                        "Remark": remark,
                        "SKIPValidator": false
                    },
                    "Products": formattedProducts,
                    "Documents": [
                        {
                            "FileName": "ERD.png",
                            "FileExtension": ".png",
                            "FileBase64": "",
                            "FileSize": 0
                        }
                    ]
                }

                console.log(request);

                const response = await axios.post(
                    "http://192.168.168.150/NEXA/api/StockMovement/Post",
                    request,
                    {
                        auth: {
                            username: getUserEmail,
                            password: getUserPassword
                        }
                    }
                );

                const responseData=response.data;

                console.log(responseData);

                if(responseData.Acknowledge==0) {
                    Alert.alert(
                        "Success",
                        "Add SMQ Success.",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: "MainStock" }],
                                    });
                                },
                            },
                        ],
                        { cancelable: false }
                    );
                }else{
                    Snackbar.show({
                        text: 'Add SMQ failed.',
                        duration: Snackbar.LENGTH_LONG,
                    });
                    setProcessData(false);
                }

            } catch (error: any) {
                Snackbar.show({
                    text: 'Connect Server failed, Please try again.',
                    duration: Snackbar.LENGTH_LONG,
                });
                console.log(error)
                setProcessData(false);
            }
        }
    }

    return (
        <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />
            
            <View style={{ flex: 1 }}>
                <HeaderBar title={`Add Stock Movement: `} checkBackBttn={true} />
                <View style={defaultCSS.LineContainer}></View>

                {processData ? (
                    <View style={{ alignSelf: "center", flex: 0.92, }}>
                        <LoadingAnimation />
                    </View>
                ) : (

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingVertical: 10, }}
                    >
                        <View style={[LoginManagementCSS.widthAndAdjustment, LoginManagementCSS.CardShadow]}>
                            <View style={[{
                                padding: 30, 
                                backgroundColor: COLORS.primaryWhiteHex,            
                                borderRadius: 16,
                                overflow: 'hidden',
                            }]}>
                                <View style={ButtonCSS.SegmentedContainer}>
                                    {["General", "Products"].map((type, index) => {
                                    const isSelected = selectedType === type;

                                    return (
                                    <Pressable
                                        key={type}
                                        onPress={() => setSelectedType(type)}
                                        style={[
                                        ButtonCSS.SegmentedButton,
                                        {
                                            backgroundColor: isSelected ? HEADERBACKGROUNDCOLORCODE : "transparent",
                                            borderBottomWidth: isSelected ? 0 : 2,
                                            borderBottomColor: isSelected ? "transparent" : COLORS.primaryGreyHex,
                                            borderTopLeftRadius: isSelected ? 8 : 0,
                                            borderTopRightRadius: isSelected ? 8 : 0,
                                            // borderRadius: isSelected ? 8 : 0,
                                            // marginHorizontal: 5,
                                        },
                                        ]}
                                    >
                                        <Text
                                        style={{
                                            color: isSelected ? COLORS.primaryWhiteHex : COLORS.primaryGreyHex,
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                        >
                                        {type === "More" ? "More Info" : type}
                                        </Text>
                                    </Pressable>
                                    );
                                })}
                                </View>

                                {(selectedType=="General") ? (
                                <>
                                <View style={{ flex: 1, marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Requester</Text>
                                        <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                    </View>
                                    <Dropdown
                                        style={AddItemScreenCSS.dropdown}
                                        placeholderStyle={AddItemScreenCSS.placeholderStyle}
                                        selectedTextStyle={AddItemScreenCSS.selectedTextStyle}
                                        inputSearchStyle={AddItemScreenCSS.inputSearchStyle}
                                        containerStyle={AddItemScreenCSS.listContainerStyle}
                                        activeColor={COLORS.primaryVeryLightGreyHex}
                                        data={requesterOptions}
                                        search
                                        searchPlaceholder="Search.."
                                        labelField="name"
                                        valueField="pkkey"
                                        placeholder={requesterName || 'Select..'}
                                        value={requester}
                                        onChange={item => {
                                            setRequester(item.pkkey);
                                            setRequesterName(item.name);
                                        }}
                                        // performance tweaks:
                                        maxHeight={300}
                                        flatListProps={{
                                            initialNumToRender: 20,
                                            windowSize: 10,
                                        }}
                                    />
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                                    <View style={{ flex: 1, marginRight: 10 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Category</Text>
                                            <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                        </View>
                                        <Dropdown
                                            style={AddItemScreenCSS.dropdown}
                                            placeholderStyle={AddItemScreenCSS.placeholderStyle}
                                            selectedTextStyle={AddItemScreenCSS.selectedTextStyle}
                                            inputSearchStyle={AddItemScreenCSS.inputSearchStyle}
                                            containerStyle={AddItemScreenCSS.listContainerStyle}
                                            activeColor={COLORS.primaryVeryLightGreyHex}
                                            data={categoryOptions}
                                            search
                                            searchPlaceholder="Search.."
                                            labelField="name"
                                            valueField="pkkey"
                                            placeholder={categoryName || 'Select Category'}
                                            value={category}
                                            onChange={item => {
                                                setCategory(item.pkkey);
                                                setCategoryName(item.name);
                                            }}
                                            // performance tweaks:
                                            maxHeight={300}
                                            flatListProps={{
                                                initialNumToRender: 20,
                                                windowSize: 10,
                                            }}
                                        />
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Movement Type</Text>
                                            <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                        </View>
                                        <Dropdown
                                            style={AddItemScreenCSS.dropdown}
                                            placeholderStyle={AddItemScreenCSS.placeholderStyle}
                                            selectedTextStyle={AddItemScreenCSS.selectedTextStyle}
                                            inputSearchStyle={AddItemScreenCSS.inputSearchStyle}
                                            containerStyle={AddItemScreenCSS.listContainerStyle}
                                            activeColor={COLORS.primaryVeryLightGreyHex}
                                            data={movementTypeOptions}
                                            search
                                            searchPlaceholder="Search..."
                                            labelField="name"
                                            valueField="pkkey"
                                            placeholder={movementTypeName || 'Select..'}
                                            value={movementType}
                                            onChange={item => {
                                                setMovementType(item.pkkey);
                                                setMovementTypeName(item.name);
                                            }}
                                            // performance tweaks:
                                            maxHeight={300}
                                            flatListProps={{
                                                initialNumToRender: 20,
                                                windowSize: 10,
                                            }}
                                        />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                                     <View style={{ flex: 1, marginRight: 10 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Receive From</Text>
                                            <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                        </View>
                                        <Dropdown
                                            style={[
                                                AddItemScreenCSS.dropdown,
                                            ]}
                                            placeholderStyle={AddItemScreenCSS.placeholderStyle}
                                            selectedTextStyle={AddItemScreenCSS.selectedTextStyle}
                                            inputSearchStyle={AddItemScreenCSS.inputSearchStyle}
                                            containerStyle={AddItemScreenCSS.listContainerStyle}
                                            activeColor={COLORS.primaryVeryLightGreyHex}
                                            data={receiveFromOptions}
                                            search
                                            searchPlaceholder="Search..."
                                            labelField="name"
                                            valueField="pkkey"
                                            placeholder={receiveFromName || 'Select..'}
                                            value={receiveFrom}
                                            onChange={item => {

                                                // Snackbar.show({
                                                //     text: "key: "+item.pkkey.toString(),
                                                //     duration: Snackbar.LENGTH_LONG,
                                                // });
                                                console.log(item.pkkey);

                                                setReceiveFrom(item.pkkey);
                                                setReceiveFromName(item.name);
                                            }}
                                            // performance tweaks:
                                            maxHeight={300}
                                            flatListProps={{
                                                initialNumToRender: 20,
                                                windowSize: 10,
                                            }}
                                        />
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Deliver To</Text>
                                            <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                        </View>
                                        <Dropdown
                                            style={[
                                                AddItemScreenCSS.dropdown,
                                            ]}
                                            placeholderStyle={AddItemScreenCSS.placeholderStyle}
                                            selectedTextStyle={AddItemScreenCSS.selectedTextStyle}
                                            inputSearchStyle={AddItemScreenCSS.inputSearchStyle}
                                            containerStyle={AddItemScreenCSS.listContainerStyle}
                                            activeColor={COLORS.primaryVeryLightGreyHex}
                                            data={deliverToOptions}
                                            search
                                            searchPlaceholder="Search..."
                                            labelField="name"
                                            valueField="pkkey"
                                            placeholder={deliverToName || 'Select..'}
                                            value={deliverTo}
                                            onChange={item => {
                                                setDeliverTo(item.pkkey);
                                                setDeliverToName(item.name);
                                            }}
                                            // performance tweaks:
                                            maxHeight={300}
                                            flatListProps={{
                                                initialNumToRender: 20,
                                                windowSize: 10,
                                            }}
                                        />
                                    </View>
                                </View>

                                <View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Purpose</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        multiline
                                        numberOfLines={5}
                                        value={purpose}
                                        onChangeText={setPurpose}
                                        style={AddItemScreenCSS.TextArea} 
                                        placeholder="Enter Purpose here"
                                    />
                                </View>

                                <View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Remark</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        multiline
                                        numberOfLines={5}
                                        value={remark}
                                        onChangeText={setRemark}
                                        style={AddItemScreenCSS.TextArea}
                                        placeholder="Enter Remark here"
                                    />
                                </View>

                                {/* ── Attach Files Section ──────────────────────────────────────── */}
                                <View style={{ marginTop: 16 }}>
                                    {/* (a) Button to open document picker */}
                                    <TouchableOpacity
                                        onPress={()=>pickFiles()}
                                        // onPress={pickFiles}
                                        style={{
                                        paddingVertical: 12,
                                        paddingHorizontal: 16,
                                        backgroundColor: COLORS.primaryLightGreyHex,
                                        borderRadius: 6,
                                        alignSelf: 'flex-start',
                                        marginVertical: 8,
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontSize: 16 }}>Attach Files</Text>
                                    </TouchableOpacity>

                                    {attachments.map((file, idx) => (
                                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                                        {file.type?.startsWith('image/') && (
                                            <Image
                                                source={{ uri: file.uri }}
                                                style={{ width: 50, height: 50, marginRight: 8, borderRadius: 4 }}
                                            />
                                        )}

                                        {file.type?.startsWith('video/') && (
                                            <MaterialCommunityIcons name="video" size={40} color="gray" style={{ marginRight: 8 }} />
                                        )}
                                        
                                        <Text style={{ flex: 1 }}>{file.fileName ?? 'Unnamed'}</Text>
                                        <TouchableOpacity onPress={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}>
                                            <Text style={{ color: 'red' }}>Remove</Text>
                                        </TouchableOpacity>
                                    </View>
                                    ))}
                                </View>
                                </>
                                ) : (
                                <>
                                {products.map((item, index) => (
                                    <View key={index} style={{ marginTop: 20, borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 10 }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Product {index + 1}</Text>
                                        <Dropdown
                                            style={[
                                                AddItemScreenCSS.dropdown,
                                                focusedDropdownIndex === index && { borderColor: COLORS.primaryDarkGreyHex }
                                            ]}
                                            placeholderStyle={AddItemScreenCSS.placeholderStyle}
                                            selectedTextStyle={AddItemScreenCSS.selectedTextStyle}
                                            inputSearchStyle={AddItemScreenCSS.inputSearchStyle}
                                            data={productOptions}
                                            search
                                            maxHeight={200}
                                            labelField="name"
                                            valueField="pkkey"
                                            placeholder={!item.name ? 'Select..' : item.name}
                                            searchPlaceholder="Search.."
                                            value={item.id}
                                            onFocus={() => setFocusedDropdownIndex(index)}
                                            onBlur={() => setFocusedDropdownIndex(null)}
                                            onChange={(option) => {
                                                const updated = [...products];
                                                updated[index].id = option.pkkey;
                                                updated[index].name = option.name; 
                                                setProducts(updated);
                                                setFocusedDropdownIndex(null);
                                            }}
                                        />

                                        <View style={{ flex: 1, marginTop: 10 }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Quantity</Text>
                                            <TextInput
                                            mode="outlined"
                                            keyboardType="numeric"
                                            value={item.quantity}
                                            onChangeText={(text) => {
                                                const updated = [...products];
                                                updated[index].quantity = text;
                                                setProducts(updated);
                                            }}
                                            placeholder="0"
                                            style={AddItemScreenCSS.NormalTextInput}
                                            />
                                        </View>

                                        <View style={{ marginTop: 10 }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Notes</Text>
                                            <TextInput
                                                mode="outlined"
                                                multiline
                                                numberOfLines={3}
                                                value={item.notes}
                                                onChangeText={(text) => {
                                                    const updated = [...products];
                                                    updated[index].notes = text;
                                                    setProducts(updated);
                                                }}
                                                placeholder="Enter any notes"
                                                style={AddItemScreenCSS.TextArea}
                                            />
                                        </View>

                                        {/* Optional: Remove product button */}
                                        {products.length > 1 && (
                                        <TouchableOpacity
                                            style={{ marginTop: 10 }}
                                            onPress={() => {
                                            const updated = products.filter((_, i) => i !== index);
                                            setProducts(updated);
                                            }}
                                        >
                                            <Text style={{ color: 'red' }}>Remove</Text>
                                        </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                                <TouchableOpacity
                                    style={[AddItemScreenCSS.AddItemBtn]}
                                    onPress={() => {
                                        setProducts([...products, { id: '', name: '', quantity: '',  notes: '',  unitPrice: '',  discount: '' }]);
                                    }}
                                    >
                                    <Text style={AddItemScreenCSS.AddItemText}>Add Product</Text>
                                </TouchableOpacity>
                                </>
                                )}

                                <TouchableOpacity style={[AddItemScreenCSS.Button, {width: "40%"}]} onPress={() => { 
                                    submitAddStock(
                                        requester,
                                        category,
                                        movementType,
                                        receiveFrom,
                                        deliverTo,
                                        purpose,
                                        remark,
                                        products,
                                        attachments,
                                    ) 
                                }}>
                                    <Text style={AddItemScreenCSS.ButtonText}> Submit </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                )}
            </View>
        </View>
    );
}
export default AddStockScreen;