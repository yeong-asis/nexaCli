import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
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

    const [movementType, setMovementType] = useState('IN');
    const [movementTypeName, setMovementTypeName] = useState('IN');
    const movementTypeOptions = [{'pkkey':'IN', 'name':'IN'}, {'pkkey':'OUT', 'name':'OUT'}];

    const [purpose, setPurpose] = useState("");
    const [remark, setRemark] = useState("");
    const [attachments, setAttachments] = useState<any[]>([]);

    // Products Part
    const [products, setProducts] = useState<ProductItem[]>([ { id: '', name: '', quantity: '', notes: '' }, ]);
    const [productOptions, setProductOption] = useState<SelectionItem[]>([]);

    const [focusedDropdownIndex, setFocusedDropdownIndex] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            const getUserID = await AsyncStorage.getItem('UserID') ?? "";
            setRequester(getUserID);
            await fetchedSelectionAPI(getUserID);
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
                setDeliverToOptions(responseData);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // supplier list
            await axios.get( 
                `${IPAddress}/api/dashboard/getSupplier` 
            ).then(async response => {
                const responseData=response.data;
                setReceiveFromOptions(responseData);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // category list
            await axios.get( 
                `${IPAddress}/api/dashboard/getSMQCategory` 
            ).then(async response => {
                const responseData=response.data;
                setCategoryOptions(responseData);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // product list
            await axios.get( 
                `${IPAddress}/api/dashboard/getProductList`
            ).then(async response => {
                const responseData=response.data;
                setProductOption(responseData);
                
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
        const checkUserFullName = await AsyncStorage.getItem('FullName') ?? "";
        const checkUserEmail = await AsyncStorage.getItem('Email') ?? "";
        const todayDate = new Date().toISOString();

        try {
            const smqRequest = {
                Id: 0,
                RequesterID: requestID,
                ValidatorRemark: null,
                ApproverRemark: null,
                ImplementerRemark: null,

                RequesterList: [
                    {
                    Id: requestID,
                    BranchID: 0,
                    TimeZoneID: 0,
                    UserName: null,
                    Password: null,
                    Name: checkUserFullName,
                    Email: checkUserEmail,
                    Department: null,
                    Role: null,
                    Superior: null,
                    IsActive: true,
                    IsEnable: true,
                    IsVerified: false,
                    Salt: null,
                    EncryptedPassword: null,
                    CreatedBy: null,
                    CreatedOn: null,
                    LastUpdatedBy: null,
                    LastUpdatedOn: null,
                    }
                ],

                ValidatorIDList: null,
                ApproverList: null,
                ImplementerList: null,

                ProductList: products.map((p: { productID: any; productName: any; sku: any; quantity: any; description: any; notes: any; }) => ({
                    Id: 0,
                    BranchID: 0,
                    SMQID: 0,
                    ProductID: p.productID,
                    ProductName: p.productName ?? null,
                    SKU: p.sku ?? null,
                    StockOnHand: null,
                    Quantity: p.quantity,
                    Description: p.description ?? null,
                    Notes: p.notes ?? null,
                    Location: null,
                    LocationName: null,
                    UnitPrice: null,
                    Discount: null,
                    Amount: null,
                    CreatedBy: null,
                    CreatedOn: todayDate,
                    LastUpdatedBy: null,
                    LastUpdatedOn: null,
                })),

                UploadAttachmentList: attachments,
                RequesterAttachment: null,
                WorkflowStatus: 1,
                KeyWord: null,

                SMQDetail: {
                    Id: 0,
                    BranchID: 0,
                    SMQCode: null,
                    Requester: requestID,
                    Category: category,
                    MovementType: movementType=="IN" ? "1" : "2",
                    ReceiveFrom: receiveFrom,
                    DeliverTo: deliverTo,
                    Purpose: purpose,
                    PTRID: null,
                    PMXID: null,
                    SO: null,
                    RMA: null,
                    ReceiverSignature: null,
                    DelivererSignature: null,
                    Remark: remark,
                    ValidatorRemark: null,
                    ApproverRemark: null,
                    ImplementerRemark: null,
                    SKIPValidator: false,
                    Status: 0,
                    IsValidateNotificationSent: false,
                    ValidateNotificationSentDate: null,
                    IsApprovalNotificationSent: false,
                    ApprovalNotificationSentDate: null,
                    IsAcceptNotificationSent: false,
                    AcceptNotificationSentDate: null,
                    CreatedBy: null,
                    CreatedOn: null,
                    LastUpdatedBy: null,
                    LastUpdatedOn: null,
                },

                SMQList: null,
                Comment: null,
                CommentDetails: null,
                UserColumn: null,
                UserID: 0,
                UserName: null,
            };

            // // 🚀 POST request
            // const response = await axios.post(
            //     "https://your-api-server.com/api/smq/submit",
            //     smqRequest,
            //     {
            //         headers: { "Content-Type": "application/json" },
            //     }
            // );

            // console.log("✅ Submitted successfully:", response.data);

        } catch (error: any) {
            console.error("❌ Submission failed:", error.message);
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
                                            placeholder={movementTypeName || 'Select'}
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
                                            placeholder={receiveFromName || 'Select...'}
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
                                            placeholder={deliverToName || 'Select....'}
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
                                        style={{ textAlignVertical: 'top' }} // Ensures text starts from top-left
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
                                        style={{ textAlignVertical: 'top' }} // Ensures text starts from top-left
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
                                            placeholder={!item.name ? 'Select product...' : item.name}
                                            searchPlaceholder="Search products..."
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
                                        setProducts([...products, { id: '', name: '', quantity: '',  notes: '' }]);
                                    }}
                                    >
                                    <Text style={AddItemScreenCSS.AddItemText}>Add Product</Text>
                                </TouchableOpacity>
                                </>
                                )}

                                <TouchableOpacity style={AddItemScreenCSS.Button} onPress={() => { 
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