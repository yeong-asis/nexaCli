import React, { useEffect, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Asset, ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { Checkbox, Menu, TextInput } from "react-native-paper";
import { AddItemScreenCSS, ButtonCSS, defaultCSS, LoginManagementCSS } from '../../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS, HEADERBACKGROUNDCOLORCODE } from '../../../themes/theme';
import HeaderBar from '../../functions/HeaderBar';
import axios from 'axios';
import { AttachmentsProps, CommentLogProps, IPAddress, SelectionItem, WorkflowLogProps } from '../../../objects/objects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { useRoute } from '@react-navigation/native';
import WorkflowLogCard from '../../../objects/Cards/WorkflowLogCard';
import CommentLogCard from '../../../objects/Cards/CommentLogCard';
import LoadingAnimation from '../../functions/LoadingAnimation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type ProductItem = {
    id: string;
    name: string;
    quantity: string;
    notes: string;
};

const DetailStockScreen = ({ navigation }: { navigation: any }) => {
    const route = useRoute();
    const { key, code, status } = route.params as any;

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
    const movementTypeOptions = [{'pkkey':'1', 'name':'IN'}, {'pkkey':'2', 'name':'OUT'}];

    const [purpose, setPurpose] = useState("");
    const [remark, setRemark] = useState("");
    const [createdDate, setCreatedDate] = useState("");
    const [attachments, setAttachments] = useState<any[]>([]);

    const [comments, setComments] = useState("");
    const [workflowLogs, setWorkflowLogs] = useState([]);
    const [commentLogs, setCommentLogs] = useState([]);
    const [currentAttachment, setCurrentAttachment] = useState<AttachmentsProps[]>([]);

    const [showSummary, setShowSummary] = useState(false);

    // Products Part
    const [products, setProducts] = useState<ProductItem[]>([]);
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
            // SMQ Detail
            await axios.get( 
                `${IPAddress}/api/dashboard/GetSMQDetail?UserId=${selectedUser}&SMQID=${key}` 
            ).then(async response => {
                const responseData=response.data;

                setRequesterName(responseData[0].requester);
                setRequester(responseData[0].requestID);
                setCategory(responseData[0].category);
                setMovementType(responseData[0].movementType);
                setReceiveFrom(responseData[0].receiveFrom);
                setDeliverTo(responseData[0].deliverTo);
                setPurpose(responseData[0].purpose);
                setRemark(responseData[0].remark);
                setCreatedDate(responseData[0].createdOn);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // SMQ Product Detail
            await axios.get( 
                `${IPAddress}/api/dashboard/GetSMQProductDetail?SMQID=${key}` 
            ).then(async response => {
                const responseData=response.data;
                console.log(responseData)

                // Transform response into the structure your component expects
                const mappedProducts = responseData.map((p: any) => ({
                    id: p.productID,           // must match productOptions valueField
                    name: p.sku,       // label for display
                    quantity: String(p.quantity),   // make sure it's string for TextInput
                    notes: p.notes || ''
                }));

                setProducts(mappedProducts);

            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // user list
            await axios.get( 
                `${IPAddress}/api/dashboard/getUser` 
            ).then(async response => {
                const responseData=response.data;
                setRequesterOptions(responseData);
                
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

            // SMQ Workflow Log
            await axios.get( 
                `${IPAddress}/api/dashboard/getSMQWorkflowLog?SMQID=${key}` 
            ).then(async response => {
                const responseData=response.data;
                setWorkflowLogs(responseData);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // SMQ Comment Log
            await axios.get( 
                `${IPAddress}/api/dashboard/getSMQCommentLog?SMQID=${key}` 
            ).then(async response => {
                const responseData=response.data;
                setCommentLogs(responseData);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });
            
            // SMQ Comment Log
            await axios.get( 
                `${IPAddress}/api/dashboard/productCRM` 
            ).then(async response => {
                const responseData=response.data;
                setProductOption(responseData);
                
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

    const showCommentLogCard = ({ item }: { item: CommentLogProps }) => {
        return (
            <TouchableOpacity onPress={() => {
                
            }} >
                <CommentLogCard 
                    pkkey={item.pkkey} 
                    personName={item.personName}
                    comment={item.comment} 
                    createdBy={item.createdBy}
                    lastUpdatedDate={item.lastUpdatedDate} 
                    lastUpdatedBy={item.lastUpdatedBy}              
                />
            </TouchableOpacity>
        );
    };

    const AddComment = async (
        
    ) => {

        try {


            // // 🚀 POST request
            // const response = await axios.post(
            //     "https://192.168.0.90:44313/api/SMQAPI/AddComment",
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
                <HeaderBar title={code} checkBackBttn={true} />
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
                                {status=="New" ? (
                                <TouchableOpacity style={AddItemScreenCSS.Button} onPress={() => { 
                                    
                                }}>
                                    <Text style={AddItemScreenCSS.ButtonText}> Edit </Text>
                                </TouchableOpacity>
                                ) : (
                                <View style={{flexDirection: "row", justifyContent: 'space-around'}}>
                                    <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryGreenHex, width:"45%",}]} onPress={() => { 
                                        setShowSummary(true)
                                        // Snackbar.show({
                                        //     text: 'Approve SMQ',
                                        //     duration: Snackbar.LENGTH_LONG,
                                        // });
                                    }}>
                                        <Text style={AddItemScreenCSS.ButtonText}> Approve </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryRedHex, width:"45%",}]} onPress={() => { 
                                        Snackbar.show({
                                            text: 'Reject SMQ',
                                            duration: Snackbar.LENGTH_LONG,
                                        });
                                    }}>
                                        <Text style={AddItemScreenCSS.ButtonText}> Reject </Text>
                                    </TouchableOpacity>
                                </View>
                                )}
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

                                {status=="New" ? (
                                <TouchableOpacity style={AddItemScreenCSS.Button} onPress={() => { 
                                    
                                }}>
                                    <Text style={AddItemScreenCSS.ButtonText}> Edit </Text>
                                </TouchableOpacity>
                                ) : (
                                <View style={{flexDirection: "row", justifyContent: 'space-around'}}>
                                    <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryGreenHex, width:"45%",}]} onPress={() => { 
                                        Snackbar.show({
                                            text: 'Approve SMQ',
                                            duration: Snackbar.LENGTH_LONG,
                                        });
                                    }}>
                                        <Text style={AddItemScreenCSS.ButtonText}> Approve </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryRedHex, width:"45%",}]} onPress={() => { 
                                        Snackbar.show({
                                            text: 'Reject SMQ',
                                            duration: Snackbar.LENGTH_LONG,
                                        });
                                    }}>
                                        <Text style={AddItemScreenCSS.ButtonText}> Reject </Text>
                                    </TouchableOpacity>
                                </View>
                                )}
                                </>
                                ) : (
                                <View style={{flex: 1}}>

                                    {workflowLogs.length>0 ? (
                                    <>
                                    <View style={{ marginTop: 10,}}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>History</Text>
                                        </View>
                                        {/* <View style={{ flexDirection: 'row', alignItems: 'baseline' }}> */}
                                            <FlatList 
                                                scrollEnabled={false}
                                                // scrollEnabled={true}
                                                // style={{height: 200,}}
                                                data={workflowLogs} 
                                                keyExtractor={(item: any) => item.pkkey}
                                                renderItem={showWorkflowLogCard} 
                                            />
                                        {/* </View> */}
                                    </View>
                                    <View style={[defaultCSS.LineContainer, {marginTop: 20}]}></View>
                                    </>
                                    ) : (<></>)}

                                    {commentLogs.length>0 ? (
                                    <>
                                    <View style={{ marginTop: 10}}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}> View Comment</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                            <FlatList 
                                                scrollEnabled={false}
                                                // scrollEnabled={true}
                                                // style={{height: 200,}}
                                                data={commentLogs} 
                                                keyExtractor={(item: any) => item.pkkey}
                                                renderItem={showCommentLogCard} 
                                            />
                                        </View>
                                    </View>
                                    <View style={[defaultCSS.LineContainer, {marginTop: 20}]}></View>
                                    </>
                                    ) : (<></>)}

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

                                    <TouchableOpacity style={AddItemScreenCSS.Button} onPress={() => {AddComment()}}>
                                        <Text style={AddItemScreenCSS.ButtonText}> Send Comment </Text>
                                    </TouchableOpacity>
                                </View>
                                )}
                            </View>

                            <Modal
                                visible={showSummary}
                                animationType="slide"
                                transparent={true}
                                onRequestClose={() => setShowSummary(false)}
                            >
                            <View style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <View style={{
                                    backgroundColor: COLORS.primaryWhiteHex,
                                    borderRadius: 12,
                                    padding: 20,
                                    width: '90%',
                                    maxHeight: '80%',
                                }}>
                                    <ScrollView>
                                        <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10}}>Summary</Text>

                                        <Text>Requester: {requesterName}</Text>
                                        <Text>Category: {categoryName}</Text>
                                        <Text>Movement Type: {movementTypeName}</Text>
                                        <Text>Receive From: {receiveFromName}</Text>
                                        <Text>Deliver To: {deliverToName}</Text>
                                        <Text>Purpose: {purpose}</Text>
                                        <Text>Date Requested: {createdDate}</Text>

                                        <Text style={{marginTop: 10, fontWeight: 'bold'}}>Products:</Text>
                                        {products.map((p, i) => (
                                        <View key={i} style={{marginVertical: 5, padding: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 6}}>
                                            <Text>Product {i+1}</Text>
                                            <Text>Name: {p.name}</Text>
                                            <Text>Quantity: {p.quantity}</Text>
                                            <Text>Notes: {p.notes}</Text>
                                        </View>
                                        ))}
                                    </ScrollView>

                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryGreyHex, width:"45%"}]} onPress={() => setShowSummary(false)}>
                                            <Text style={AddItemScreenCSS.ButtonText}>Close</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryGreenHex, width:"45%"}]}
                                            onPress={() => {
                                                setShowSummary(false);
                                                Snackbar.show({
                                                text: 'Final Approve Sent!',
                                                duration: Snackbar.LENGTH_LONG,
                                                });
                                                // Here you could call your API to submit final approval
                                            }}
                                        >
                                            <Text style={AddItemScreenCSS.ButtonText}>Confirm</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            </Modal>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                )}
            </View>
        </View>
    );
}
export default DetailStockScreen;