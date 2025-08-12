import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Checkbox, TextInput } from "react-native-paper";
import { IPAddress, SelectionItem } from '../../../objects/objects';
import { AddItemScreenCSS, ButtonCSS, defaultCSS, LoginManagementCSS } from '../../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS, HEADERBACKGROUNDCOLORCODE } from '../../../themes/theme';
import HeaderBar from '../../functions/HeaderBar';
import LoadingAnimation from '../../functions/LoadingAnimation';

type ProductItem = {
    name: string;
    quantity: string;
    unitPrice: string;
    notes: string;
    discount: string;
};

const AddMaterialScreen = ({ navigation }: { navigation: any }) => {
    const [processData, setProcessData] = useState(false);
    const [selectedType, setSelectedType] = useState("General");

    const [requester, setRequester] = useState("");
    const [requesterName, setRequesterName] = useState("");
    const [requesterMenuVisible, setRequesterMenuVisible] = useState(false);
    const [requesterOptions, setRequesterOptions] = useState<SelectionItem[]>([]);
    // const requesterOptions = ["Alice", "Bob", "Charlie", "David"];

    const [category, setCategory] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState<SelectionItem[]>([]);
    // const categoryOptions = ['Production', 'Project', 'Marketing'];

    const [customer, setCustomer] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerMenuVisible, setCustomerMenuVisible] = useState(false);
    const [customerOptions, setCustomerOptions] = useState<SelectionItem[]>([]);
    // const customerOptions = ['Customer A', 'Customer B', 'Customer C'];

    const [supplier, setSupplier] = useState('');
    const [supplierName, setSupplierName] = useState('');
    const [supplierMenuVisible, setSupplierMenuVisible] = useState(false);
    const [supplierOptions, setSupplierOptions] = useState<SelectionItem[]>([]);
    // const supplierOptions = ['Supplier A', 'Supplier B', 'Supplier C'];

    const [currency, setCurrency] = useState('');
    const [currencyName, setCurrencyName] = useState('');
    const [currencyMenuVisible, setCurrencyMenuVisible] = useState(false);
    const [currencyOptions, setCurrencyOptions] = useState<SelectionItem[]>([]);
    // const currencyOptions = ['SGD', 'MYR', 'USD'];

    const [paymentTerm, setPaymentTerm] = useState('');
    const [paymentTermName, setPaymentTermName] = useState('');
    const [paymentTermMenuVisible, setPaymentTermMenuVisible] = useState(false);
    const [paymentTermOptions, setPaymentTermOptions] = useState<SelectionItem[]>([]);
    // const paymentTermOptions = ['COD', 'TT in Advance', '15 days', '30 days', '60 days'];

    const [project, setProject] = useState("");
    const [paymentInstruction, setPaymentInstruction] = useState("");
    const [shipping, setShipping] = useState("");
    const [remark, setRemark] = useState("");
    const [skipValidator, setSkipValidator] = useState(false);

    const [attachments, setAttachments] = useState<any[]>([]);

    // Products Part
    const [products, setProducts] = useState<ProductItem[]>([
        { name: '', quantity: '', unitPrice: '', notes: '', discount: '' },
    ]);

    const [focusedDropdownIndex, setFocusedDropdownIndex] = useState<number | null>(null);

    // const productOptions = ['AB_ACPU', 'AB_C302ST', 'CAC-ACPU'];
    const productOptions = [
        { label: 'AB_ACPU', value: 'AB_ACPU' },
        { label: 'AB_C302ST', value: 'AB_C302ST' },
        { label: 'CAC-ACPU', value: 'CAC-ACPU' }
    ];

    useEffect(() => {
        (async () => {
            const getUserID = await AsyncStorage.getItem('UserID') ?? "";
            setRequester(getUserID);
            await fetchedSelectionAPI(getUserID);
        })();
    }, []);

    const calculateAmount = (quantity: string, price: string, discount: string) => {
        const q = parseFloat(quantity) || 0;
        const p = parseFloat(price) || 0;
        const d = parseFloat(discount) || 0;
        const amount = q * p * (1 - d / 100);

        return new Intl.NumberFormat('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        }).format(amount);
    };

    // const pickFiles = async () => {
    //     try {
    //         const result = await DocumentPicker.getDocumentAsync({
    //         type: '*/*',
    //         multiple: true,
    //         copyToCacheDirectory: true,
    //         });

    //         // Newer versions return { canceled: boolean; assets?: Array<...> }
    //         // Older versions returned { type: 'success' | 'cancel', uri, name, size, mimeType }
    //         if ('canceled' in result) {
    //             // SDK ≥ 48 style: “canceled” + possibly “assets”
    //             if (!result.canceled) {
    //                 // If multiple was supported, result.assets is an array:
    //                 if (Array.isArray((result as any).assets)) {
    //                     setAttachments(prev => [...prev, ...((result as any).assets)]);
    //                 } else {
    //                     // If multiple not supported, it may still be a single object with uri/name:
    //                     // (Some platforms only return a single “asset” object.)
    //                     const single = (result as any).assets?.[0] ?? result;
    //                     setAttachments(prev => [...prev, single]);
    //                 }
    //             }
    //         } else if ((result as any).type) {
    //             // Fallback for older SDKs where result.type === 'success' | 'cancel'
    //             if ((result as any).type === 'success') {
    //                 setAttachments(prev => [...prev, result]);
    //             }
    //             // if type === 'cancel', do nothing
    //         }
    //     } catch (err) {
    //         console.warn('Error picking files:', err);
    //     }
    // };

    const fetchedSelectionAPI = async(selectedUser: any) => {
        setProcessData(true);
        // console.log(selectedUser)

        try {
            // user list
            await axios.get( 
                `${IPAddress}/api/dashboard/getUser` 
            ).then(async response => {
                
                const responseData=response.data;
                setRequesterOptions(responseData);

                const user = responseData.find((u: any) => u.pkkey === selectedUser);
                setRequesterName(user?.fullName ?? '');
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // customer list
            await axios.get( 
                `${IPAddress}/api/dashboard/getCustomer` 
            ).then(async response => {
                
                const responseData=response.data;
                setCustomerOptions(responseData);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // supplier list
            await axios.get( 
                `${IPAddress}/api/dashboard/getSupplier` 
            ).then(async response => {
                
                const responseData=response.data;
                setSupplierOptions(responseData);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // currency list
            await axios.get( 
                `${IPAddress}/api/dashboard/getCurrency` 
            ).then(async response => {
                
                const responseData=response.data;
                setCurrencyOptions(responseData);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // payment term list
            await axios.get( 
                `${IPAddress}/api/dashboard/getPaymentTerms` 
            ).then(async response => {
                
                const responseData=response.data;
                setPaymentTermOptions(responseData);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // category list
            await axios.get( 
                `${IPAddress}/api/dashboard/getMRQCategory` 
            ).then(async response => {
                
                const responseData=response.data;
                setCategoryOptions(responseData);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            setProcessData(false);

        }catch (error: any) {
            setProcessData(false);
            console.log("Error: "+error);
        }
    };

    return (
        <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />
            
            <View style={{ flex: 1 }}>
                <HeaderBar title={`Add Material Request: `} checkBackBttn={true} />
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
                        contentContainerStyle={{
                            paddingVertical: 10,
                        }}
                    >
                        <View style={[LoginManagementCSS.widthAndAdjustment, LoginManagementCSS.CardShadow]}>
                            <View style={[{
                                padding: 30, 
                                backgroundColor: COLORS.primaryWhiteHex,            
                                borderRadius: 16,
                                overflow: 'hidden',
                            }]}>
                                <View style={ButtonCSS.SegmentedContainer}>
                                    <Pressable 
                                        style={[ButtonCSS.SegmentedButton, {
                                            borderTopLeftRadius: 20, 
                                            borderBottomLeftRadius: 20, 
                                            backgroundColor: selectedType=="General" ? HEADERBACKGROUNDCOLORCODE : COLORS.primaryWhiteHex
                                        }]}
                                        onPress={()=> {
                                            setSelectedType("General");
                                        }}
                                    >
                                        <Text style={[ButtonCSS.SegmentedText, {color: selectedType=="General" ? COLORS.primaryWhiteHex : COLORS.primaryGreyHex}]}>General</Text>
                                    </Pressable>
                                    <Pressable 
                                        style={[ButtonCSS.SegmentedButton, {
                                            borderTopRightRadius: 20, 
                                            borderBottomRightRadius: 20, 
                                            backgroundColor: selectedType=="Products" ? HEADERBACKGROUNDCOLORCODE : COLORS.primaryWhiteHex
                                        }]}
                                        onPress={()=> {
                                            setSelectedType("Products");
                                        }}
                                    >
                                        <Text style={[ButtonCSS.SegmentedText, {color: selectedType=="Products" ? COLORS.primaryWhiteHex : COLORS.primaryGreyHex}]}>Products</Text>
                                    </Pressable>
                                </View>

                                {/* <View style={{flexDirection: "column", marginTop: 0}}>
                                    <Text style={AddItemScreenCSS.TextTitleFont}>Please fill in the required fields:</Text>
                                </View> */}

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
                                        searchPlaceholder="Search Requester..."
                                        labelField="name"
                                        valueField="pkkey"
                                        placeholder={requesterName || 'Select Requester'}
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

                                <View style={{ marginTop: 10 }}>
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
                                        searchPlaceholder="Search Category..."
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

                                <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                                    <View style={{ flex: 1, marginRight: 10 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Customer</Text>
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
                                            data={customerOptions}
                                            search
                                            searchPlaceholder="Search customer..."
                                            labelField="name"
                                            valueField="pkkey"
                                            placeholder={customerName || 'Select customer'}
                                            value={customer}
                                            onChange={item => {
                                                setCustomer(item.pkkey);
                                                setCustomerName(item.name);
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
                                            <Text style={AddItemScreenCSS.TextInputFont}>Supplier</Text>
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
                                            data={supplierOptions}
                                            search
                                            searchPlaceholder="Search supplier..."
                                            labelField="name"
                                            valueField="pkkey"
                                            placeholder={supplierName || 'Select supplier'}
                                            value={supplier}
                                            onChange={item => {
                                                setSupplier(item.pkkey);
                                                setSupplierName(item.name);
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
                                        <Text style={AddItemScreenCSS.TextInputFont}>Project</Text>
                                        <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        multiline
                                        numberOfLines={3}
                                        value={project}
                                        onChangeText={setProject}
                                        style={AddItemScreenCSS.InputTextArea}
                                        placeholder="Enter project description here"
                                    />
                                </View>

                                {/* Currency and Payment Terms in one row */}
                                <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                                    {/* Currency Input */}
                                    <View style={{ flex: 1, marginRight: 10 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Currency</Text>
                                            <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                        </View>
                                        <Dropdown
                                            style={AddItemScreenCSS.dropdown}
                                            placeholderStyle={AddItemScreenCSS.placeholderStyle}
                                            selectedTextStyle={AddItemScreenCSS.selectedTextStyle}
                                            inputSearchStyle={AddItemScreenCSS.inputSearchStyle}
                                            containerStyle={AddItemScreenCSS.listContainerStyle}
                                            activeColor={COLORS.primaryVeryLightGreyHex}
                                            data={currencyOptions}
                                            search
                                            searchPlaceholder="Search Currency..."
                                            labelField="name"
                                            valueField="pkkey"
                                            placeholder={currencyName || 'Select Currency'}
                                            value={currency}
                                            onChange={item => {
                                                setCurrency(item.pkkey);
                                                setCurrencyName(item.name);
                                            }}
                                            // performance tweaks:
                                            maxHeight={300}
                                            flatListProps={{
                                                initialNumToRender: 20,
                                                windowSize: 10,
                                            }}
                                        />
                                    </View>

                                    {/* Payment Terms Input */}
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Payment Terms</Text>
                                            <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                        </View>
                                        <Dropdown
                                            style={AddItemScreenCSS.dropdown}
                                            placeholderStyle={AddItemScreenCSS.placeholderStyle}
                                            selectedTextStyle={AddItemScreenCSS.selectedTextStyle}
                                            inputSearchStyle={AddItemScreenCSS.inputSearchStyle}
                                            containerStyle={AddItemScreenCSS.listContainerStyle}
                                            activeColor={COLORS.primaryVeryLightGreyHex}
                                            data={paymentTermOptions}
                                            search
                                            searchPlaceholder="Search Payment Terms..."
                                            labelField="name"
                                            valueField="pkkey"
                                            placeholder={paymentTermName || 'Select Payment Terms'}
                                            value={paymentTerm}
                                            onChange={item => {
                                                setPaymentTerm(item.pkkey);
                                                setPaymentTermName(item.name);
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
                                        <Text style={AddItemScreenCSS.TextInputFont}>Payment Instruction</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        multiline
                                        numberOfLines={5}
                                        value={paymentInstruction}
                                        onChangeText={setPaymentInstruction}
                                        style={AddItemScreenCSS.InputTextArea}
                                        placeholder="Enter Payment Instruction here"
                                    />
                                </View>

                                <View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Shipping</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        multiline
                                        numberOfLines={5}
                                        value={shipping}
                                        onChangeText={setShipping}
                                        style={AddItemScreenCSS.InputTextArea}
                                        placeholder="Enter Shipping here"
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
                                        style={AddItemScreenCSS.InputTextArea}
                                        placeholder="Enter Remark here"
                                    />
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                    <View style={AddItemScreenCSS.CheckboxCSS}>
                                        <Checkbox
                                            status={skipValidator ? 'checked' : 'unchecked'}
                                            onPress={() => setSkipValidator(!skipValidator)}
                                        />
                                    </View>
                                    <Text style={[AddItemScreenCSS.TextInputFont, { marginLeft: 8 }]}>
                                        Skip Validator
                                    </Text>
                                </View>

                                {/* ── Attach Files Section ──────────────────────────────────────── */}
                                <View style={{ marginTop: 16 }}>
                                    {/* (a) Button to open document picker */}
                                    <TouchableOpacity
                                        onPress={()=>console.log("pick file")}
                                        // onPress={pickFiles}
                                        style={{
                                        paddingVertical: 12,
                                        paddingHorizontal: 16,
                                        backgroundColor: COLORS.primaryLightGreyHex,
                                        borderRadius: 6,
                                        alignSelf: 'flex-start',
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontSize: 16 }}>Attach Files</Text>
                                    </TouchableOpacity>

                                    {/* (b) Show a list of picked files, each with a “Remove” control */}
                                    {attachments.map((file, idx) => (
                                        <View
                                        key={idx}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: 8,
                                            padding: 8,
                                            backgroundColor: '#F5F5F5',
                                            borderRadius: 4,
                                        }}
                                        >
                                        {/* Show the file name (truncate if too long) */}
                                        <Text
                                            style={{ flex: 1, fontSize: 14 }}
                                            numberOfLines={1}
                                            ellipsizeMode="middle"
                                        >
                                            {file.name ?? 'Unknown file'}
                                        </Text>

                                        {/* “Remove” button to drop this attachment */}
                                        <TouchableOpacity
                                            onPress={() => {
                                            setAttachments(prev => prev.filter((_, i) => i !== idx));
                                            }}
                                            style={{ paddingHorizontal: 8, paddingVertical: 4 }}
                                        >
                                            <Text style={{ color: 'red', fontSize: 14 }}>Remove</Text>
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
                                            activeColor={COLORS.primaryVeryLightGreyHex}
                                            data={productOptions}
                                            search
                                            maxHeight={200}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={!item.name ? 'Select product...' : item.name}
                                            searchPlaceholder="Search products..."
                                            value={item.name}
                                            onFocus={() => setFocusedDropdownIndex(index)}
                                            onBlur={() => setFocusedDropdownIndex(null)}
                                            onChange={(option) => {
                                                const updated = [...products];
                                                updated[index].name = option.value;
                                                setProducts(updated);
                                                setFocusedDropdownIndex(null);
                                            }}
                                        />

                                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                            <View style={{ flex: 1, marginRight: 10 }}>
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
                                                />
                                            </View>

                                            <View style={{ flex: 1 }}>
                                                <Text style={AddItemScreenCSS.TextInputFont}>Unit Price</Text>
                                                <TextInput
                                                mode="outlined"
                                                keyboardType="numeric"
                                                value={item.unitPrice}
                                                onChangeText={(text) => {
                                                    const updated = [...products];
                                                    updated[index].unitPrice = text;
                                                    setProducts(updated);
                                                }}
                                                placeholder="0.00"
                                                />
                                            </View>
                                        </View>

                                        <View style={{ marginTop: 10 }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Notes</Text>
                                            <TextInput
                                                mode="outlined"
                                                multiline
                                                numberOfLines={3}
                                                value={item.notes}
                                                style={AddItemScreenCSS.InputTextArea}
                                                onChangeText={(text) => {
                                                    const updated = [...products];
                                                    updated[index].notes = text;
                                                    setProducts(updated);
                                                }}
                                                placeholder="Enter any notes"
                                            />
                                        </View>

                                        <View style={{ marginTop: 10 }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Discount (%)</Text>
                                            <TextInput
                                            mode="outlined"
                                            keyboardType="numeric"
                                            value={item.discount}
                                            onChangeText={(text) => {
                                                const updated = [...products];
                                                updated[index].discount = text;
                                                setProducts(updated);
                                            }}
                                            placeholder="0"
                                            />
                                        </View>

                                        <View style={{ marginTop: 10 }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Amount {currency!="" ? ("("+currency+")") : ("")}</Text>
                                            <TextInput
                                            mode="outlined"
                                            value={calculateAmount(item.quantity, item.unitPrice, item.discount)}
                                            editable={false}
                                            placeholder="0.00"
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
                                        setProducts([...products, { name: '', quantity: '', unitPrice: '', notes: '', discount: '' }]);
                                    }}
                                    >
                                    <Text style={AddItemScreenCSS.AddItemText}>Add Product</Text>
                                </TouchableOpacity>
                                </>
                                )}

                                <TouchableOpacity style={AddItemScreenCSS.Button} onPress={() => {console.log("Done")}}>
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
export default AddMaterialScreen;