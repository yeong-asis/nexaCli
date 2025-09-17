import React, { useEffect, useState } from 'react';
import { Alert, Animated, FlatList, Image, KeyboardAvoidingView, LogBox, Modal, PermissionsAndroid, Platform, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Asset, ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { Checkbox, Menu, TextInput } from "react-native-paper";
import { AddItemScreenCSS, ButtonCSS, defaultCSS, LoginManagementCSS } from '../../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS, HEADERBACKGROUNDCOLORCODE, SetBorderWidth } from '../../../themes/theme';
import HeaderBar from '../../functions/HeaderBar';
import axios from 'axios';
import { CommentLogProps, IPAddress, SelectionItem, Validators, WorkflowLogProps } from '../../../objects/objects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { useRoute } from '@react-navigation/native';
import WorkflowLogCard from '../../../objects/Cards/WorkflowLogCard';
import CommentLogCard from '../../../objects/Cards/CommentLogCard';
import LoadingAnimation from '../../functions/LoadingAnimation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { Swipeable } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { requestDownloadPermission } from '../../functions/requestPermission';

type ProductItem = {
    id: string;
    name: string;
    quantity: string;
    notes: string;
};

const DetailStockScreen = ({ navigation }: { navigation: any }) => {
    const route = useRoute();
    const { key, code, status } = route.params as any;

    const [currentUserID, setCurrentUserID] = useState("");

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
    const [validators, setValidators] = useState<Validators[]>([]);
    const [isValidators, setIsValidators] = useState(false);
    const [createdDate, setCreatedDate] = useState("");
    const [attachments, setAttachments] = useState<any[]>([]);

    const [comments, setComments] = useState("");
    const [workflowLogs, setWorkflowLogs] = useState([]);
    const [commentLogs, setCommentLogs] = useState([]);
    const [replyTo, setReplyTo] = React.useState<CommentLogProps | null>(null);
    // const [replyID, setReplyID] = useState("");
    const [currentAttachment, setCurrentAttachment] = useState<any[]>([]);

    const [showSummary, setShowSummary] = useState(false);

    // Products Part
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [productOptions, setProductOption] = useState<SelectionItem[]>([]);

    const [focusedDropdownIndex, setFocusedDropdownIndex] = useState<number | null>(null);
    
    useEffect(() => {
        (async () => {
            LogBox.ignoreAllLogs(true);
            setProcessData(true);
            await fetchedSelectionAPI();
            await fetchedDetailAPI();
            await fetchedLogCommentAPI();
            setProcessData(false);
        })();
    }, []);

    const pickFiles = async () => {
        try {
            const results = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
                allowMultiSelection: true,
            });

            const filesWithBase64 = await Promise.all(
                results.map(async (file) => {
                    let base64Data = null;

                    // Only read base64 for non-video files (videos can be huge!)
                    if (!file.type?.startsWith('video/')) {
                        base64Data = await RNFS.readFile(file.uri, 'base64');
                    }

                    return {
                        uri: file.uri,
                        fileName: file.name,
                        type: file.type ?? 'unknown',
                        size: file.size,
                        base64: base64Data, 
                    };
                })
            );

            setAttachments((prev) => [...prev, ...filesWithBase64]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled');
            } else {
                console.error(err);
            }
        }
    };

    const fetchedSelectionAPI = async() => {
        const getUserID = await AsyncStorage.getItem('UserID') ?? "";
        const getUserEmail = await AsyncStorage.getItem('Email') ?? "";
        const getUserPassword = await AsyncStorage.getItem('Password') ?? "";

        setCurrentUserID(getUserID);

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

            }else{
                Snackbar.show({
                    text: 'Connect Server failed, Please try again.',
                    duration: Snackbar.LENGTH_LONG,
                });
                setProcessData(false);
            }

        }catch (error: any) {
            setProcessData(false);
            Snackbar.show({
                text: "Error: "+error,
                duration: Snackbar.LENGTH_LONG,
            });
        }
    };

    const fetchedDetailAPI = async() => {
        const getUserID = await AsyncStorage.getItem('UserID') ?? "";
        const getUserEmail = await AsyncStorage.getItem('Email') ?? "";
        const getUserPassword = await AsyncStorage.getItem('Password') ?? "";

        try {
            const response = await axios.post(
                "http://192.168.168.150/NEXA/api/StockMovement/Get",
                {
                    "APIAction": "GetSMQById",
                    "UserID": getUserID,
                    "SMQ": {
                        "Id": key
                    }
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
                setRequesterName(responseData.SMQ.Requester);
                setRequester(responseData.SMQ.RequesterID);
                setCategory(responseData.SMQ.Category);
                setCategoryName(responseData.SMQ.CategoryName);
                setMovementType(responseData.SMQ.MovementType);
                
                setReceiveFrom(responseData.SMQ.ReceiveFrom);
                setReceiveFromName(responseData.SMQ.ReceiveFromName);
                
                setDeliverTo(responseData.SMQ.DeliverTo);
                setDeliverToName(responseData.SMQ.DeliverToName);

                setPurpose(responseData.SMQ.Purpose);
                setRemark(responseData.SMQ.Remark);
                setCreatedDate(responseData.SMQ.CreatedOn);

                const formattedValidator = responseData.SMQ.Validators.map((item: any) => {
                    return {
                        pkkey: String(item.Id),
                        name: item.Name,
                    };
                });
                setValidators(formattedValidator);
                const isCurrentUserValidator = formattedValidator.some((v: Validators) => v.pkkey === getUserID);
                setIsValidators(isCurrentUserValidator);

                const formattedMessages = responseData.Products.map((item: any) => {
                    return {
                        id: item.DEARID,
                        name: item.SKU,
                        quantity: String(item.Quantity),
                        notes: item.Notes,
                    };
                });
                setProducts(formattedMessages);

            }else{
                Snackbar.show({
                    text: "Load data failed.",
                    duration: Snackbar.LENGTH_LONG,
                });
            }

        }catch (error: any) {
            setProcessData(false);
            Snackbar.show({
                text: "Error: "+error,
                duration: Snackbar.LENGTH_LONG,
            });
        }
    }

    const fetchedLogCommentAPI = async() => {
        const getUserID = await AsyncStorage.getItem('UserID') ?? "";
        const getUserEmail = await AsyncStorage.getItem('Email') ?? "";
        const getUserPassword = await AsyncStorage.getItem('Password') ?? "";

        try {
            const responseDetail = await axios.post(
                "http://192.168.168.150/NEXA/api/StockMovement/Get",
                {
                    "APIAction": "GetSMQInfo",
                    "UserID": getUserID,
                    "SMQ": {
                        "Id": key
                    }
                },
                {
                    auth: {
                        username: getUserEmail,
                        password: getUserPassword
                    }
                }
            );

            const responseData=responseDetail.data;
            if(responseData.Acknowledge==0) {
                if(responseData.Activities && responseData.Activities.length>0){
                    const formattedMessages = responseData.Activities.map((item: any) => {
                        const newLogOnDate = new Date(item.LogOn).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
                        return {
                            pkkey: item.Id,
                            SMQID: item.SMQID,
                            personName: item.CreatedBy,
                            comment: item.LogDetail,
                            process: item.Process,
                            logOn: newLogOnDate,
                            status: item.Status,
                            parentCommentID: item.ParentCommentID,
                        };
                    });
                    setWorkflowLogs(formattedMessages);
                }

                if(responseData.Comments && responseData.Comments.length>0){
                    const commentMessages = responseData.Comments.map((item: any) => {
                        const newCreatedOn = new Date(item.CreatedOn).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
                        return {
                            pkkey: item.ID,
                            SMQID: item.SMQID,
                            process: "",
                            personName: item.CreatedBy,
                            parentCommentID: item.ParentCommentID,
                            comment: item.Comment,
                            logOn: newCreatedOn,
                            status: item.status,
                        };
                    });
                    const arrangedComments: any = arrangeComments(commentMessages);
                    setCommentLogs(arrangedComments);
                }

                if(responseData.Documents && responseData.Documents.length>0){
                    const formattedDocuments = responseData.Documents.map((item: any) => {
                        return {
                            pkkey: item.Id,
                            FileName: item.FileName,
                            FileBase64: item.FileBase64,
                            FileSize: item.FileSize,
                            Stage: item.Stage,
                        };
                    });
                    setCurrentAttachment(formattedDocuments);
                }

            }else{
                Snackbar.show({
                    text: "View Log and Comment failed. ",
                    duration: Snackbar.LENGTH_LONG,
                });
            }

        }catch (error: any) {
            setProcessData(false);
            Snackbar.show({
                text: "Error: "+error,
                duration: Snackbar.LENGTH_LONG,
            });
        }
    }

    const arrangeComments = (comments: CommentLogProps[]): CommentLogProps[] => {
        const commentMap: Record<string, CommentLogProps[]> = {};

        // Group by parentCommentID
        comments.forEach((c) => {
            const parentId = c.parentCommentID || "0";
            if (!commentMap[parentId]) commentMap[parentId] = [];
            commentMap[parentId].push(c);
        });

        const result: CommentLogProps[] = [];

        const addComments = (parentId: string) => {
            const children = commentMap[parentId] || [];
            children.forEach((child) => {
                result.push(child);
                addComments(child.pkkey); // recursively add replies under this comment
            });
        };

        addComments("0"); // start from top-level comments
        return result;
    };

    const EditSMQ = async (
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

            try {
                const formattedProducts = products.map((p: any) => ({
                    DEARID: p.id,
                    Notes: p.notes || "",
                    Quantity: Number(p.quantity) || 0,
                    UnitPrice: Number(p.unitPrice) || 0,
                    Discount: Number(p.discount) || 0,
                    Amount: (Number(p.quantity) || 0) * (Number(p.unitPrice) || 0)
                }));

                const documents = attachments.map((file: any) => {
                    const extension = file.type ? `.${file.type.split('/')[1]}` : '';
                    return {
                        FileName: file.fileName ?? "",
                        FileExtension: extension,
                        FileBase64: file.base64 ?? "",
                        FileSize: file.size ?? 0
                    };
                });

                const request = {
                    "APIAction": "EditSMQ",
                    "SMQ": {
                        "Id": Number(key),
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
                    "Documents": documents
                }

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

                if(responseData.Acknowledge==0) {
                    Snackbar.show({
                        text: 'Edit SMQ Success.',
                        duration: Snackbar.LENGTH_LONG,
                    });
                    setProcessData(false);
                }else{
                    Snackbar.show({
                        text: 'Edit SMQ failed.',
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

        setProcessData(false);
    }

    const AddComment = async (
        Comments: any,
        replyTo: any,
    ) => {
        const getUserID = await AsyncStorage.getItem('UserID') ?? "";
        const getUserEmail = await AsyncStorage.getItem('Email') ?? "";
        const getUserPassword = await AsyncStorage.getItem('Password') ?? "";

        try {

            const responseDetail = await axios.post(
                "http://192.168.168.150/NEXA/api/StockMovement/Post",
                {
                    "APIAction": "AddComment",
                    "UserID": Number(getUserID),
                    "Comment": {
                        "ID": 0,
                        "SMQID": Number(key),
                        "ParentCommentID": replyTo.pkkey ?? 0,
                        "Comment": Comments
                    }
                },
                {
                    auth: {
                        username: getUserEmail,
                        password: getUserPassword
                    }
                }
            );

            const responseData=responseDetail.data;
            
            if(responseData.Acknowledge==0) {
                setComments("");
                setReplyTo(null);
                fetchedLogCommentAPI();
            }else{
                Snackbar.show({
                    text: "Add comment failed ",
                    duration: Snackbar.LENGTH_LONG,
                });
            }
            
        }catch (error: any) {
            setProcessData(false);
            Snackbar.show({
                text: "Error: "+error,
                duration: Snackbar.LENGTH_LONG,
            });
        }
    }

    const handleDownload = async (doc: any) => {
        const hasPermission = await requestDownloadPermission();
        if (!hasPermission) {
            Alert.alert('Permission denied', 'Cannot download file without permission.');
            return;
        }

        try {
            const fileName = doc.FileName || 'downloaded_file';
            const base64Data = doc.FileBase64;

            if (!base64Data || base64Data.length === 0) {
                Alert.alert('Download Error', 'No file data available');
                return;
            }

            // Determine path
            const path =
            Platform.OS === 'android'
                ? `${RNFS.DownloadDirectoryPath}/${fileName}`
                : `${RNFS.DocumentDirectoryPath}/${fileName}`;

            await RNFS.writeFile(path, base64Data, 'base64');

            Alert.alert('Download Complete', `File saved to ${path}`);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to download file.');
        }
    };


    const showWorkflowLogCard = ({ item }: { item: WorkflowLogProps }) => {
        return (
            <TouchableOpacity onPress={() => { }} >
                <WorkflowLogCard 
                    pkkey={item.pkkey}
                    personName={item.personName}
                    comment={item.comment}
                    logOn={item.logOn} 
                    SMQID={item.SMQID} 
                    process={item.process}          
                />
            </TouchableOpacity>
        );
    };

    const showCommentLogCard = ({ item }: { item: CommentLogProps }) => {
        const renderRightActions = () => (
            <View style={{ padding: replyTo==null ? 15 : 0 }}>
                {/* <Text style={{ color: 'white', fontWeight: 'bold' }}>Reply</Text> */}
            </View>
        );

        return (
            <Swipeable renderRightActions={renderRightActions} onSwipeableOpen={() => {
                if(item.parentCommentID=="0"){
                    setReplyTo(item);
                }
            }}>
                <CommentLogCard 
                    pkkey={item.pkkey}
                    personName={item.personName}
                    comment={item.comment}
                    logOn={item.logOn} 
                    SMQID={item.SMQID} 
                    process={item.process} 
                    status={item.status}  
                    parentCommentID={item.parentCommentID}    
                    onReplyPress={() => setReplyTo(item)}         
                />
            </Swipeable>
        );
    };

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
                                    {["General", "Products", "More"].map((type, index) => {
                                        const isSelected = selectedType === type;

                                        return (
                                        <Pressable
                                            key={type}
                                            onPress={() => setSelectedType(type)}
                                            style={[
                                            ButtonCSS.SegmentedButton,
                                            {
                                                backgroundColor: isSelected ? HEADERBACKGROUNDCOLORCODE : "transparent",
                                                borderWidth: isSelected ? 2 : 0,
                                                borderColor: isSelected ? HEADERBACKGROUNDCOLORCODE : "transparent",
                                                borderBottomWidth: isSelected ? 2 : 2,
                                                borderBottomColor: COLORS.primaryGreyHex,
                                                borderTopLeftRadius: isSelected ? 8 : 0,
                                                borderTopRightRadius: isSelected ? 8 : 0,
                                            },
                                            ]}
                                        >
                                            <Text
                                            style={{
                                                color: isSelected ? COLORS.primaryWhiteHex : COLORS.primaryGreyHex,
                                                fontWeight: isSelected ? "bold" : "normal",
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
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline', marginVertical: 5 }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Requester</Text>
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

                                <View style={{ flex: 1, marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline', marginVertical: 5 }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Category</Text>
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

                                <View style={{ flex: 1, marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline', marginVertical: 5 }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Movement Type</Text>
                                    </View>
                                    {movementTypeOptions.map(option => (
                                        <TouchableOpacity
                                            key={option.pkkey}
                                            style={AddItemScreenCSS.RadioContainer}
                                            onPress={() => {
                                                setMovementType(option.pkkey);
                                                setMovementTypeName(option.name);
                                            }}
                                        >
                                        <View style={AddItemScreenCSS.RadioRow}>
                                            {String(movementType) === option.pkkey && <View style={{
                                                height: 10,
                                                width: 10,
                                                borderRadius: 5,
                                                backgroundColor: HEADERBACKGROUNDCOLORCODE
                                            }} />}
                                        </View>
                                            <Text style={AddItemScreenCSS.RadioText}>{option.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View style={{ flex: 1, marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline', marginVertical: 5 }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Receive From</Text>
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
                                            setReceiveFrom(item.pkkey);
                                            setReceiveFromName(item.name);
                                        }}
                                        maxHeight={300}
                                        flatListProps={{
                                            initialNumToRender: 20,
                                            windowSize: 10,
                                        }}
                                    />
                                </View>

                                <View style={{ flex: 1, marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline', marginVertical: 5 }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Deliver To</Text>
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
                                        maxHeight={300}
                                        flatListProps={{
                                            initialNumToRender: 20,
                                            windowSize: 10,
                                        }}
                                    />
                                </View>

                                <View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline', marginVertical: 5 }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Purpose</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        multiline
                                        numberOfLines={5}
                                        value={purpose}
                                        onChangeText={setPurpose}
                                        placeholder="Enter Purpose here"
                                        style={AddItemScreenCSS.TextArea}
                                        outlineStyle={{ borderWidth: SetBorderWidth }}
                                    />
                                </View>

                                <View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline', marginVertical: 5 }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Remark</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        multiline
                                        numberOfLines={5}
                                        value={remark}
                                        onChangeText={setRemark}
                                        placeholder="Enter Remark here"
                                        style={AddItemScreenCSS.TextArea}
                                        outlineStyle={{ borderWidth: SetBorderWidth }}
                                    />
                                </View>

                                {/* ── Attach Files Section ──────────────────────────────────────── */}
                                <View style={{ marginTop: 16 }}>

                                    {(requester==currentUserID) && (
                                        <TouchableOpacity
                                            onPress={()=>pickFiles()}
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
                                    )}

                                    {currentAttachment.map((doc, idx) => (
                                        <View 
                                        key={doc.Id ?? idx} 
                                        style={{ 
                                            flexDirection: "row", 
                                            alignItems: "center", 
                                            justifyContent: "space-between", 
                                            paddingVertical: 8, 
                                            borderBottomWidth: 1, 
                                            borderBottomColor: "#ddd" 
                                        }}
                                        >
                                        <Text style={{ flex: 1 }}>{doc.FileName || "Unnamed Document"}</Text>
                                        
                                        <TouchableOpacity 
                                            onPress={() => handleDownload(doc)} 
                                        >
                                            <Ionicons name="download-outline" size={12} color={COLORS.primaryGreyHex} style={{marginHorizontal: 10}} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate('ViewAttachment', {
                                                doc: doc, 
                                            });
                                        }} >
                                            <Ionicons name="eye-outline" size={12} color={COLORS.primaryGreyHex} style={{marginHorizontal: 10}} />
                                        </TouchableOpacity>
                                        </View>
                                    ))}


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

                                <View style={{ flexDirection: 'column', justifyContent: 'space-around', marginTop: 10 }}>
                                { (requester==currentUserID) ? ( 
                                    <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryLightGreyHex}]} onPress={() => {
                                        EditSMQ(
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
                                        <Text style={AddItemScreenCSS.ButtonText}> Edit </Text>
                                    </TouchableOpacity>
                                ) : ( 
                                    <></> 
                                )}

                                { (isValidators==true) ? (
                                    <>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: HEADERBACKGROUNDCOLORCODE,}]} onPress={() => { 
                                            setShowSummary(true)
                                        }}>
                                            <Text style={AddItemScreenCSS.ButtonText}> Approve </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryRedHex,}]} onPress={() => { 
                                            Snackbar.show({
                                                text: 'Reject SMQ',
                                                duration: Snackbar.LENGTH_LONG,
                                            });
                                        }}>
                                            <Text style={AddItemScreenCSS.ButtonText}> Reject </Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <></>
                                )}
                                </View>

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
                                            outlineStyle={{ borderWidth: SetBorderWidth }}
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
                                                outlineStyle={{ borderWidth: SetBorderWidth }}
                                            />
                                        </View>

                                        {/* Optional: Remove product button */}
                                        {(requester==currentUserID) && (products.length > 1) && (
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
                                
                                {(requester==currentUserID) && (
                                <TouchableOpacity
                                    style={[AddItemScreenCSS.AddItemBtn]}
                                    onPress={() => {
                                        setProducts([...products, { id: '', name: '', quantity: '',  notes: '' }]);
                                    }}
                                    >
                                    <Text style={AddItemScreenCSS.AddItemText}>Add Product</Text>
                                </TouchableOpacity>
                                )}

                                <View style={{ flexDirection: 'column', justifyContent: 'space-around', marginTop: 5 }}>
                                { (requester==currentUserID) ? ( 
                                    <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryLightGreyHex}]} onPress={() => { 
                                        EditSMQ(
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
                                        <Text style={AddItemScreenCSS.ButtonText}> Edit </Text>
                                    </TouchableOpacity>
                                ) : ( 
                                    <></> 
                                )}

                                { (isValidators==true) ? (
                                    <>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: HEADERBACKGROUNDCOLORCODE,}]} onPress={() => { 
                                            setShowSummary(true)
                                        }}>
                                            <Text style={AddItemScreenCSS.ButtonText}> Approve </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryRedHex,}]} onPress={() => { 
                                            Snackbar.show({
                                                text: 'Reject SMQ',
                                                duration: Snackbar.LENGTH_LONG,
                                            });
                                        }}>
                                            <Text style={AddItemScreenCSS.ButtonText}> Reject </Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <></>
                                )}
                                </View>
                                
                                </>
                                ) : (
                                <View style={{flex: 1}}>

                                    {workflowLogs.length>0 ? (
                                    <>
                                    <View style={{ marginTop: 10,}}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginVertical: 5 }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>History</Text>
                                        </View>
                                        <FlatList 
                                            nestedScrollEnabled={false}
                                            // nestedScrollEnabled={true}
                                            data={workflowLogs}
                                            keyExtractor={(item: any) => item.pkkey}
                                            renderItem={showWorkflowLogCard} 
                                            // style={{ height: workflowLogs.length == 1 ? 60 : workflowLogs.length == 2 ? 100 : workflowLogs.length == 3 ? 150 : workflowLogs.length == 4 ? 200 : 250 }}
                                        />
                                    </View>
                                    <View style={[defaultCSS.LineContainer, {marginTop: 20}]}></View>
                                    </>
                                    ) : (<></>)}

                                    {commentLogs.length>0 ? (
                                    <>
                                    <View style={{ marginTop: 10}}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginVertical: 5 }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}> View Comment</Text>
                                        </View>
                                        <FlatList 
                                            nestedScrollEnabled={false}
                                            // nestedScrollEnabled={true}
                                            data={commentLogs} 
                                            keyExtractor={(item: any) => item.pkkey}
                                            renderItem={showCommentLogCard} 
                                            // style={{ height: commentLogs.length == 1 ? 60 : commentLogs.length == 2 ? 100 : commentLogs.length == 3 ? 150 : commentLogs.length == 4 ? 200 : 250 }}
                                        />
                                    </View>
                                    <View style={[defaultCSS.LineContainer, {marginTop: 20}]}></View>
                                    </>
                                    ) : (<></>)}

                                    <View style={{ marginTop: 30 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginVertical: 5 }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Comment</Text>
                                        </View>
                                        {replyTo && (
                                        <View style={AddItemScreenCSS.ReplyCommentCSS}>
                                            <View style={{flexDirection: "row", justifyContent: "space-between",}}>
                                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                                                    Replying to {replyTo.personName}
                                                </Text>
                                                <TouchableOpacity onPress={() => setReplyTo(null)}>
                                                    <Text style={{ fontSize: 10, color: 'red', marginTop: 4 }}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 12, color: '#555' }} numberOfLines={1}>
                                                    {replyTo.comment}
                                                </Text>
                                            </View>
                                        </View>
                                        )}
                                        <TextInput
                                            label=""
                                            mode="outlined"
                                            multiline
                                            numberOfLines={5}
                                            value={comments}
                                            onChangeText={setComments}
                                            style={AddItemScreenCSS.TextArea}
                                            placeholder="Write your comment..."
                                            outlineStyle={{ borderWidth: SetBorderWidth }}
                                        />
                                    </View>

                                    <TouchableOpacity style={[AddItemScreenCSS.Button, {marginTop: 10, width: "45%"}]} onPress={() => {AddComment(comments, replyTo)}}>
                                        <Text style={AddItemScreenCSS.ButtonText}> Comment </Text>
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