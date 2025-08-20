import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Checkbox, TextInput } from "react-native-paper";
import { AttachmentsProps, IPAddress, SelectionItem, WorkflowInfoProps, WorkflowLogProps } from '../../../objects/objects';
import WorkflowLogCard from '../../../objects/Cards/WorkflowLogCard';
import WorkflowInfoCard from '../../../objects/Cards/WorkflowInfoCard';
import { AddItemScreenCSS, ButtonCSS, defaultCSS, LoginManagementCSS } from '../../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS, HEADERBACKGROUNDCOLORCODE } from '../../../themes/theme';
import HeaderBar from '../../functions/HeaderBar';
import LoadingAnimation from '../../functions/LoadingAnimation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Asset, ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';

type ProductItem = {
    name: string;
    quantity: string;
    unitPrice: string;
    notes: string;
    discount: string;
};

const MaterialDetailScreen = ({ navigation }: { navigation: any }) => {
    const route = useRoute();
    const { key, code } = route.params as any;
    const [processData, setProcessData] = useState(false);
    const [selectedType, setSelectedType] = useState("General");
    const [fetchedData, setFetchedData] = useState([]);

    const [requester, setRequester] = useState("");
    const [requesterName, setRequesterName] = useState("");
    const [requesterOptions, setRequesterOptions] = useState<SelectionItem[]>([]);
    // const requesterOptions = ["Alice", "Bob", "Charlie", "David"];

    const [category, setCategory] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [categoryOptions, setCategoryOptions] = useState<SelectionItem[]>([]);

    const [customer, setCustomer] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerOptions, setCustomerOptions] = useState<SelectionItem[]>([]);

    const [supplier, setSupplier] = useState('');
    const [supplierName, setSupplierName] = useState('');
    const [supplierOptions, setSupplierOptions] = useState<SelectionItem[]>([]);

    const [currency, setCurrency] = useState('');
    const [currencyName, setCurrencyName] = useState('');
    const [currencyOptions, setCurrencyOptions] = useState<SelectionItem[]>([]);

    const [paymentTerm, setPaymentTerm] = useState('');
    const [paymentTermName, setPaymentTermName] = useState('');
    const [paymentTermOptions, setPaymentTermOptions] = useState<SelectionItem[]>([]);

    const [project, setProject] = useState("");
    const [PTR, setPTR] = useState("");
    const [paymentInstruction, setPaymentInstruction] = useState("");
    const [shipping, setShipping] = useState("");
    const [remark, setRemark] = useState("");
    const [skipValidator, setSkipValidator] = useState(false);

    const [attachments, setAttachments] = useState<any[]>([]);
    const [workflowLogs, setWorkflowLogs] = useState([]);
    const [POQInfo, setPOQInfo] = useState([]);
    const [PTRInfo, setPTRInfo] = useState([]);
    const [currentAttachment, setCurrentAttachment] = useState<AttachmentsProps[]>([]);
    const [comments, setComments] = useState("");

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
            // console.log("show Key: "+key)
            await fetchedDataAPI();
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

    const fetchedDataAPI = async() => {
        setProcessData(true);
        setFetchedData([]);
        const getUserID = await AsyncStorage.getItem('UserID') ?? "";

        try {
            await axios.get( 
                `${IPAddress}/api/dashboard/materialDetail?detailID=${key}` 
            ).then(async response => {
                
                const responseData=response.data;

                console.log(responseData)
                
                setRequester(responseData[0].requester);
                setCustomer(responseData[0].customer);
                setSupplier(responseData[0].supplier);
                setCategory(responseData[0].category);
                setCurrency(responseData[0].currency);
                setPaymentTerm(responseData[0].paymentTerm);
                setProject(responseData[0].project);
                setPTR(responseData[0].ptr);
                setRemark(responseData[0].remark);

                await fetchedSelectionAPI(
                    responseData[0].requester,
                    responseData[0].customer,
                    responseData[0].supplier,
                    responseData[0].category,
                    responseData[0].currency,
                    responseData[0].paymentTerm,
                    responseData[0].ptr
                );

                const formattedMessages = responseData.map((item: any) => {
                    return {
                        pkkey: item.pkkey,
                        requester: item.requester,
                        category: item.category,
                        customer: item.customer,
                        supplier: item.supplier,
                        ptr: item.ptr,
                        project: item.project,
                        currency: item.currency,
                        paymentTerm: item.paymentTerm,
                        paymentInstruction: item.paymentInstruction,
                        shipping: item.shipping,
                        remark: item.remark,
                    };
                });

                if(formattedMessages.length>0){
                    setFetchedData(formattedMessages);
                }
                setProcessData(false);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

        }catch (error: any) {
            setProcessData(false);
            console.log("Error: "+error);
        }
    };

    const fetchedSelectionAPI = async(
        selectedUser: any,
        selectedCustomer: any,
        selectedSupplier: any,
        selectedCategory: any,
        selectedCurrency: any,
        selectedPaymentTerm: any,
        ptrID: any,
    ) => {
        setRequesterOptions([]);

        try {
            await axios.get( 
                `${IPAddress}/api/dashboard/getUser` 
            ).then(async response => {
                
                const responseData=response.data;
                setRequesterOptions(responseData);

                // const user = responseData.find((u: any) => u.name === selectedUser);
                const user = responseData.find((u: any) => u.pkkey === selectedUser);
                setRequesterName(user?.name ?? '');
                
            }).catch(error => {
                console.log(error);
            });

            // customer list
            await axios.get( 
                `${IPAddress}/api/dashboard/getCustomer` 
            ).then(async response => {
                
                const responseData=response.data;
                setCustomerOptions(responseData);

                const customer = responseData.find((c: any) => c.pkkey === selectedCustomer);
                setCustomerName(customer?.name ?? '');
                
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

                const supplier = responseData.find((s: any) => s.pkkey === selectedSupplier);
                setSupplierName(supplier?.name ?? '');
                
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

                const currency = responseData.find((c: any) => c.pkkey === selectedCurrency);
                setCurrencyName(currency?.name ?? '');
                
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

                const paymentTerm = responseData.find((p: any) => p.pkkey === selectedPaymentTerm);
                setPaymentTermName(paymentTerm?.name ?? '');
                
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

                const category = responseData.find((c: any) => c.pkkey === selectedCategory);
                setCategoryName(category?.name ?? '');
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // workflow log list
            await axios.get( 
                `${IPAddress}/api/dashboard/getMRQWorkflowLog?MRQID=${key}` 
            ).then(async response => {
                
                const responseData=response.data;
                setWorkflowLogs(responseData);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // attachment list
            await axios.get( 
                `${IPAddress}/api/dashboard/getMRQAttachment?MRQID=${key}` 
            ).then(async response => {
                
                const responseData=response.data;
                setCurrentAttachment(responseData);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // POQ list
            await axios.get( 
                `${IPAddress}/api/dashboard/getPOQInfo?MRQID=${key}` 
            ).then(async response => {
                
                const responseData=response.data;
                setPOQInfo(responseData);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // PTR list
            if(ptrID!="0"){
                await axios.get( 
                    `${IPAddress}/api/dashboard/getPTRInfo?PTRID=${ptrID}` 
                ).then(async response => {
                    
                    const responseData=response.data;
                    setPTRInfo(responseData);
                    
                }).catch(error => {
                    setProcessData(false);
                    console.log(error);
                });
            }

            setProcessData(false);
        }catch (error: any) {
            setProcessData(false);
            console.log("Error: "+error);
        }
    };

    const showWorkflowLogCard = ({ item }: { item: WorkflowLogProps }) => {
        return (
            <TouchableOpacity onPress={() => {
                
            }} >
                <WorkflowLogCard 
                    pkkey={item.pkkey} 
                    logDetail={item.logDetail} 
                    lastUpdatedDate={item.lastUpdatedDate} 
                    lastUpdatedBy={item.lastUpdatedBy}              
                />
            </TouchableOpacity>
        );
    };

    const showWorkflowCard = ({ item }: { item: WorkflowInfoProps }) => {
        return (
            <TouchableOpacity onPress={() => {
                
            }} >
                <WorkflowInfoCard 
                    pkkey={item.pkkey} 
                    code={item.code} 
                    Status={item.Status} 
                    lastUpdatedDate={item.lastUpdatedDate} 
                    lastUpdatedBy={item.lastUpdatedBy}              
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />
            
            <View style={{ flex: 1 }}>
                <HeaderBar title={`${code}`} checkBackBttn={true} />
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
                                            backgroundColor: selectedType=="Products" ? HEADERBACKGROUNDCOLORCODE : COLORS.primaryWhiteHex
                                        }]}
                                        onPress={()=> {
                                            setSelectedType("Products");
                                        }}
                                    >
                                        <Text style={[ButtonCSS.SegmentedText, {color: selectedType=="Products" ? COLORS.primaryWhiteHex : COLORS.primaryGreyHex}]}>Products</Text>
                                    </Pressable>
                                    <Pressable 
                                        style={[ButtonCSS.SegmentedButton, {
                                            borderTopRightRadius: 20, 
                                            borderBottomRightRadius: 20, 
                                            backgroundColor: selectedType=="More" ? HEADERBACKGROUNDCOLORCODE : COLORS.primaryWhiteHex
                                        }]}
                                        onPress={()=> {
                                            setSelectedType("More");
                                        }}
                                    >
                                        <Text style={[ButtonCSS.SegmentedText, {color: selectedType=="More" ? COLORS.primaryWhiteHex : COLORS.primaryGreyHex}]}>More Info</Text>
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
                                            style={[
                                                AddItemScreenCSS.dropdown,
                                            ]}
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
                                        onPress={()=>pickFiles()}
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

                                    {attachments.map((file, idx) => (
                                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
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

                                <TouchableOpacity style={AddItemScreenCSS.Button} onPress={() => {console.log("Done")}}>
                                    <Text style={AddItemScreenCSS.ButtonText}> Submit </Text>
                                </TouchableOpacity>

                                </>
                                ) : (selectedType=="Products") ? (
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

                                <TouchableOpacity style={AddItemScreenCSS.Button} onPress={() => {console.log("Done")}}>
                                    <Text style={AddItemScreenCSS.ButtonText}> Submit </Text>
                                </TouchableOpacity>
                                </>
                                ) : (
                                <View style={{flex: 1}}>
                                {PTR!="0" && (
                                <View style={{ marginTop: 20, }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Production Trigger</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <FlatList 
                                            scrollEnabled={false}
                                            data={PTRInfo} 
                                            keyExtractor={(item: any) => item.pkkey}
                                            renderItem={showWorkflowCard} 
                                        />
                                    </View>
                                </View>
                                )}

                                {POQInfo.length>0 && (
                                <View style={{ marginTop: 20}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Purchase Request</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <FlatList 
                                            scrollEnabled={false}
                                            data={POQInfo} 
                                            keyExtractor={(item: any) => item.pkkey}
                                            renderItem={showWorkflowCard} 
                                        />
                                    </View>
                                </View>
                                )}

                                <View style={{ marginTop: 20, }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>History</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <FlatList 
                                            // scrollEnabled
                                            scrollEnabled={false}
                                            // style={{height: 250,}}
                                            data={workflowLogs} 
                                            keyExtractor={(item: any) => item.pkkey}
                                            renderItem={showWorkflowLogCard} 
                                        />
                                    </View>
                                </View>

                                <View style={{ marginTop: 30 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Comment</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        multiline
                                        numberOfLines={5}
                                        value={comments}
                                        onChangeText={setComments}
                                        style={AddItemScreenCSS.InputTextArea}
                                        placeholder="Write your comment..."
                                    />
                                </View>

                                <TouchableOpacity style={AddItemScreenCSS.Button} onPress={() => {console.log("Send Comment")}}>
                                    <Text style={AddItemScreenCSS.ButtonText}> Send Comment </Text>
                                </TouchableOpacity>
                                </View>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                )}
            </View>
        </View>
    );
}
export default MaterialDetailScreen;