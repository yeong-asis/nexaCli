import React, { useEffect, useState } from 'react';
import { Alert, Animated, FlatList, Image, KeyboardAvoidingView, LogBox, Modal, PermissionsAndroid, Platform, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Asset, ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { Checkbox, Menu, TextInput } from "react-native-paper";
import { AddItemScreenCSS, ButtonCSS, defaultCSS, LoginManagementCSS } from '../../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS, HEADERBACKGROUNDCOLORCODE, SetBorderWidth } from '../../../themes/theme';
import HeaderBar from '../../functions/HeaderBar';
import axios from 'axios';
import { CommentLogProps, IPAddress, SelectionItem, Validators, WorkflowLogProps, WorkflowNextStatusMap, WorkflowStatusMap } from '../../../objects/objects';
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
import { ChangeDateTime } from '../../functions/StandardFunction';

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
    const [currentUserName, setCurrentUserName] = useState("");

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
    const [editTarget, setEditTarget] = useState<CommentLogProps | null>(null);
    const [currentAttachment, setCurrentAttachment] = useState<any[]>([]);

    const [showSummary, setShowSummary] = useState(false);
    const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(null);
    const [disableEdit, setDisableEdit] = useState(true);

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
        const getUserName = await AsyncStorage.getItem('FullName') ?? "";

        setCurrentUserID(getUserID);
        setCurrentUserName(getUserName);

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
                
                if((status=="New" || status=="Validated" || status=="Rejected") && (responseData.SMQ.RequesterID==getUserID)){
                    setDisableEdit(false);
                }else{
                    setDisableEdit(true);
                }

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
                    setCurrentAttachment(prev => [
                        ...prev,
                        ...attachments.map((file: any) => {
                            const extension = file.type ? `.${file.type.split('/')[1]}` : '';
                            return {
                                FileName: file.fileName ?? "",
                                FileExtension: extension,
                                FileBase64: file.base64 ?? "",
                                FileSize: file.size ?? 0,
                            };
                        })
                    ]);
                    setAttachments([]);
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
                        "ParentCommentID": replyTo==null ? 0 : replyTo.pkkey,
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
                await fetchedLogCommentAPI();
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

    const EditComment = async (
        commentId: string, 
        newText: string,
        parentCommentID: string,
    ) => {
        const getUserID = await AsyncStorage.getItem('UserID') ?? "";
        const getUserEmail = await AsyncStorage.getItem('Email') ?? "";
        const getUserPassword = await AsyncStorage.getItem('Password') ?? "";

        try {
            const responseDetail = await axios.post(
                "http://192.168.168.150/NEXA/api/StockMovement/Post",
                {
                    "APIAction": "EditComment",
                    "UserID": Number(getUserID),
                    "Comment": {
                        "ID": Number(commentId),
                        "SMQID": Number(key),
                        "ParentCommentID": Number(parentCommentID),
                        "Comment": newText
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
                await fetchedLogCommentAPI();
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

    const DeleteComment = async (
        CommentID: any,
        Comment: any,
    ) => {
        const getUserID = await AsyncStorage.getItem('UserID') ?? "";
        const getUserEmail = await AsyncStorage.getItem('Email') ?? "";
        const getUserPassword = await AsyncStorage.getItem('Password') ?? "";

        try {

            Alert.alert(
                "Delete Comment",
                `Are you sure you want to delete comment? \n${Comment}`,
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Yes",
                        style: "destructive", // iOS red button
                        onPress: async () => {
                            const responseDetail = await axios.post(
                                "http://192.168.168.150/NEXA/api/StockMovement/Post",
                                {
                                    "APIAction": "DeleteComment",
                                    "UserID": Number(getUserID),
                                    "Comment": {
                                        "ID": Number(CommentID),
                                        "SMQID": Number(key),
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
                                await fetchedLogCommentAPI();
                            }else{
                                Snackbar.show({
                                    text: "Delete comment failed ",
                                    duration: Snackbar.LENGTH_LONG,
                                });
                            }
                        }
                    }
                ],
                { cancelable: true }
            );
            
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

    const processNextStep = async (
        requestID: any, 
        category: any,
        movementType: any,
        receiveFrom: any,
        deliverTo: any,
        purpose: any,
        remark: any,
        products: any,
        attachments: any,
        getStatus: any,
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
            const checkUserID = await AsyncStorage.getItem('UserID') ?? "";
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

                const countStage = WorkflowStatusMap[status] ?? 1; 
                let workflowStage = countStage+1;
                let WorkflowStatus = 0;

                if(getStatus=="yes"){
                    WorkflowStatus = workflowStage;
                }else if(getStatus=="close"){
                    WorkflowStatus = 9;
                }else if(getStatus=="revise"){
                    workflowStage = 7;
                    WorkflowStatus = 1;
                }else if(getStatus=="cancel"){
                    workflowStage = 7;
                    WorkflowStatus = 10;
                }else{
                    WorkflowStatus = 0;
                }

                const request = {
                    "APIAction": "UpdateStatus",
                    "UserID": Number(checkUserID),
                    "WorkflowStage": Number(workflowStage),
                    "WorkflowStatus": Number(WorkflowStatus),
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

                console.log(request)

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
                    Alert.alert(
                        getStatus=="yes" || getStatus=="close" || getStatus=="revise" ? "Success" 
                            : getStatus=="cancel" ? "Cancel SMQ" 
                            : "Reject SMQ",

                        getStatus=="yes" ? "Process to SMQ next step successfully." 
                            : getStatus=="close" ? "Close SMQ Success." 
                            : getStatus=="revise" ? "Revise SMQ Success."
                            : getStatus=="cancel" ? "SMQ has been cancelled." 
                            : "SMQ has been rejected",
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
                        text: responseData.Message,
                        duration: Snackbar.LENGTH_LONG,
                    });
                    console.log(responseData.Message)
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
        let CanEdit = false;
        if(currentUserName==item.personName){
            CanEdit = true;
        }else{
            CanEdit = false;
        }
        
        return (
            <CommentLogCard 
                pkkey={item.pkkey}
                personName={item.personName}
                comment={item.comment}
                logOn={item.logOn}
                SMQID={item.SMQID}
                process={item.process}
                status={item.status}
                parentCommentID={item.parentCommentID}
                checkCommentEdit={CanEdit}
                onReplyPress={() => setReplyTo(item)}
                onEditPress={() => {
                    setComments(item.comment);
                    setEditTarget(item);
                }}
                onDeletePress={() => DeleteComment(item.pkkey, item.comment)}             
            />
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
                                        disable={disableEdit}
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
                                        disable={disableEdit}
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
                                            disabled={disableEdit}
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
                                        disable={disableEdit}
                                        style={AddItemScreenCSS.dropdown}
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
                                        disable={disableEdit}
                                        style={AddItemScreenCSS.dropdown}
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
                                        disabled={disableEdit}
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
                                        disabled={disableEdit}
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

                                    {(requester==currentUserID && !disableEdit) && (
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
                                                <Ionicons name="download-outline" size={18} color={COLORS.primaryGreyHex} style={{marginHorizontal: 10}} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                navigation.navigate('ViewAttachment', {
                                                    doc: doc, 
                                                });
                                            }} >
                                                <Ionicons name="eye-outline" size={18} color={COLORS.primaryGreyHex} style={{marginHorizontal: 10}} />
                                            </TouchableOpacity>
                                            {!disableEdit && (
                                            <TouchableOpacity onPress={() => {
                                                Alert.alert(
                                                    `Delete ${doc.FileName}`,
                                                    "Are you sure you want to delete it?",
                                                    [
                                                        {
                                                            text: "Cancel",
                                                            style: "cancel"
                                                        },
                                                        {
                                                            text: "Delete",
                                                            style: "destructive", // iOS red button
                                                            onPress: async () => {
                                                                const getUserEmail = await AsyncStorage.getItem('Email') ?? "";
                                                                const getUserPassword = await AsyncStorage.getItem('Password') ?? "";
                                                                console.log(currentUserID+" - "+doc.pkkey+" - "+key)
                                                                const responseDetail = await axios.post(
                                                                    "http://192.168.168.150/NEXA/api/StockMovement/Post",
                                                                    {
                                                                        "APIAction": "DeleteDocument",
                                                                        "UserID": Number(currentUserID),
                                                                        "Document": {
                                                                            "Id": Number(doc.pkkey),
                                                                            "DocHubID": Number(key),
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
                                                                    await fetchedLogCommentAPI();
                                                                    Snackbar.show({
                                                                        text: "Delete Document Successfully ",
                                                                        duration: Snackbar.LENGTH_LONG,
                                                                    });
                                                                }else{
                                                                    Snackbar.show({
                                                                        text: "Delete Document failed ",
                                                                        duration: Snackbar.LENGTH_LONG,
                                                                    });
                                                                }
                                                            }
                                                        }
                                                    ],
                                                    { cancelable: true }
                                                );
                                            }} >
                                                <Ionicons name="trash-outline" size={18} color={COLORS.primaryGreyHex} style={{marginHorizontal: 10}} />
                                            </TouchableOpacity>
                                            )}
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
                                { (requester==currentUserID && (status=="New" || status=="Validated" || status=="Rejected")) ? ( 
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
                                        <Text style={AddItemScreenCSS.ButtonText}> {"Edit"} </Text>
                                    </TouchableOpacity>
                                ) : ( 
                                    <></> 
                                )}

                                { (isValidators==true) && (
                                    <>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: HEADERBACKGROUNDCOLORCODE,}]} onPress={() => { 
                                            setModalAction("approve"); 
                                            setShowSummary(true)
                                        }}>
                                            <Text style={AddItemScreenCSS.ButtonText}> {WorkflowNextStatusMap[status]} </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryRedHex,}]} onPress={() => { 
                                            setModalAction("reject"); 
                                            setShowSummary(true)
                                        }}>
                                            <Text style={AddItemScreenCSS.ButtonText}> Reject </Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                { (requester==currentUserID && status=="Completed") && (
                                    <>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: HEADERBACKGROUNDCOLORCODE,}]} onPress={() => { 
                                            processNextStep(
                                                requester,
                                                category,
                                                movementType,
                                                receiveFrom,
                                                deliverTo,
                                                purpose,
                                                remark,
                                                products,
                                                attachments,
                                                "close",
                                            );
                                        }}>
                                            <Text style={AddItemScreenCSS.ButtonText}> {"Close"} </Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                { (requester==currentUserID && status=="Rejected") && (
                                    <>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: HEADERBACKGROUNDCOLORCODE,}]} onPress={() => { 
                                            processNextStep(
                                                requester,
                                                category,
                                                movementType,
                                                receiveFrom,
                                                deliverTo,
                                                purpose,
                                                remark,
                                                products,
                                                attachments,
                                                "revise",
                                            );
                                        }}>
                                            <Text style={AddItemScreenCSS.ButtonText}> {"Revise"} </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryRedHex,}]} onPress={() => { 
                                            processNextStep(
                                                requester,
                                                category,
                                                movementType,
                                                receiveFrom,
                                                deliverTo,
                                                purpose,
                                                remark,
                                                products,
                                                attachments,
                                                "cancel",
                                            );
                                        }}>
                                            <Text style={AddItemScreenCSS.ButtonText}> {"Cancel"} </Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                </View>

                                </>
                                ) : (selectedType=="Products") ? (
                                <>
                                {products.map((item, index) => (
                                    <View key={index} style={{ marginTop: 20, borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 10 }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Product {index + 1}</Text>
                                        <Dropdown
                                            disable={disableEdit}
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
                                            disabled={disableEdit}
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
                                                disabled={disableEdit}
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
                                        {(!disableEdit) && (products.length > 1) && (
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
                                
                                {(!disableEdit) && (
                                <TouchableOpacity
                                    style={[AddItemScreenCSS.AddItemBtn]}
                                    onPress={() => {
                                        setProducts([...products, { id: '', name: '', quantity: '',  notes: '' }]);
                                    }}
                                    >
                                    <Text style={AddItemScreenCSS.AddItemText}>Add Product</Text>
                                </TouchableOpacity>
                                )}

                                <View style={{ flexDirection: 'column', justifyContent: 'space-around', marginTop: 10 }}>
                                { (requester==currentUserID && (status=="New" || status=="Validated" || status=="Rejected")) ? ( 
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
                                        <Text style={AddItemScreenCSS.ButtonText}> {"Edit"} </Text>
                                    </TouchableOpacity>
                                ) : ( 
                                    <></> 
                                )}

                                { (isValidators==true) && (
                                    <>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: HEADERBACKGROUNDCOLORCODE,}]} onPress={() => { 
                                            setModalAction("approve"); 
                                            setShowSummary(true)
                                        }}>
                                            <Text style={AddItemScreenCSS.ButtonText}> {WorkflowNextStatusMap[status]} </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryRedHex,}]} onPress={() => { 
                                            setModalAction("reject"); 
                                            setShowSummary(true)
                                        }}>
                                            <Text style={AddItemScreenCSS.ButtonText}> Reject </Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                { (requester==currentUserID && status=="Completed") && (
                                    <>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: HEADERBACKGROUNDCOLORCODE,}]} onPress={() => { 
                                            processNextStep(
                                                requester,
                                                category,
                                                movementType,
                                                receiveFrom,
                                                deliverTo,
                                                purpose,
                                                remark,
                                                products,
                                                attachments,
                                                "close",
                                            );
                                        }}>
                                            <Text style={AddItemScreenCSS.ButtonText}> {"Close"} </Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                { (requester==currentUserID && status=="Rejected") && (
                                    <>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: HEADERBACKGROUNDCOLORCODE,}]} onPress={() => { 
                                            processNextStep(
                                                requester,
                                                category,
                                                movementType,
                                                receiveFrom,
                                                deliverTo,
                                                purpose,
                                                remark,
                                                products,
                                                attachments,
                                                "revise",
                                            );
                                        }}>
                                            <Text style={AddItemScreenCSS.ButtonText}> {"Revise"} </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryRedHex,}]} onPress={() => { 
                                            processNextStep(
                                                requester,
                                                category,
                                                movementType,
                                                receiveFrom,
                                                deliverTo,
                                                purpose,
                                                remark,
                                                products,
                                                attachments,
                                                "cancel",
                                            );
                                        }}>
                                            <Text style={AddItemScreenCSS.ButtonText}> {"Cancel"} </Text>
                                        </TouchableOpacity>
                                    </>
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
                                        {editTarget && (
                                        <View style={AddItemScreenCSS.ReplyCommentCSS}>
                                            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                                                    Editing comment from {editTarget.personName}
                                                </Text>
                                                <TouchableOpacity onPress={() => {
                                                    setEditTarget(null);
                                                    setComments("");
                                                }}>
                                                    <Text style={{ fontSize: 10, color: 'red', marginTop: 4 }}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 12, color: '#555' }} numberOfLines={1}>
                                                    {editTarget.comment}
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

                                    <TouchableOpacity 
                                    style={[AddItemScreenCSS.Button, { marginTop: 10 }]} 
                                    onPress={() => {
                                        if (editTarget) {
                                            EditComment(editTarget.pkkey, comments, editTarget.parentCommentID);
                                            setEditTarget(null);
                                        } else {
                                            AddComment(comments, replyTo);
                                            setReplyTo(null);
                                        }
                                        setComments("");
                                    }}>
                                        <Text style={AddItemScreenCSS.ButtonText}>
                                            {editTarget ? "Update Comment" : "Comment"}
                                        </Text>
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
                            <View style={defaultCSS.ModalBackground}>
                                <View style={defaultCSS.ModalContainer}>
                                    <ScrollView>
                                        <Text style={defaultCSS.ModalMainTextTitle}>Summary</Text>

                                        <View style={defaultCSS.ModalFontContainer}>
                                            <Text style={defaultCSS.ModalTextTitle}>Requester: </Text> 
                                            <Text style={defaultCSS.ModalTextTitle2}>{requesterName}</Text>
                                        </View>
                                        <View style={defaultCSS.ModalFontContainer}>
                                            <Text style={defaultCSS.ModalTextTitle}>Category: </Text> 
                                            <Text style={defaultCSS.ModalTextTitle2}>{categoryName}</Text>
                                        </View>
                                        <View style={defaultCSS.ModalFontContainer}>
                                            <Text style={defaultCSS.ModalTextTitle}>Movement Type: </Text> 
                                            <Text style={defaultCSS.ModalTextTitle2}>{movementTypeName}</Text>
                                        </View>
                                        <View style={defaultCSS.ModalFontContainer}>
                                            <Text style={defaultCSS.ModalTextTitle}>Receive From: </Text> 
                                            <Text style={defaultCSS.ModalTextTitle2}>{receiveFromName}</Text>
                                        </View>
                                        <View style={defaultCSS.ModalFontContainer}>
                                            <Text style={defaultCSS.ModalTextTitle}>Deliver To: </Text> 
                                            <Text style={defaultCSS.ModalTextTitle2}>{deliverToName}</Text>
                                        </View>
                                        <View style={defaultCSS.ModalFontContainer}>
                                            <Text style={defaultCSS.ModalTextTitle}>Purpose: </Text> 
                                            <Text style={defaultCSS.ModalTextTitle2}>{purpose}</Text>
                                        </View>
                                        <View style={defaultCSS.ModalFontContainer}>
                                            <Text style={defaultCSS.ModalTextTitle}>Date Requested: </Text> 
                                            <Text style={defaultCSS.ModalTextTitle2}>{ChangeDateTime(createdDate)}</Text>
                                        </View>

                                        <Text style={[defaultCSS.ModalTextTitle, {marginTop: 10,}]}>Products:</Text>
                                        {products.map((p, i) => (
                                        <View key={i} style={defaultCSS.ModalProductContainer}>
                                            {/* <View style={defaultCSS.ModalFontContainer}>
                                                <Text style={defaultCSS.ModalTextTitle}>Product: </Text> 
                                                <Text style={defaultCSS.ModalTextTitle2}>{i+1}</Text>
                                            </View> */}
                                            <View style={defaultCSS.ModalFontContainer}>
                                                <Text style={defaultCSS.ModalTextTitle}>Name: </Text> 
                                                <Text style={defaultCSS.ModalTextTitle2}>{p.name}</Text>
                                            </View>
                                            <View style={defaultCSS.ModalFontContainer}>
                                                <Text style={defaultCSS.ModalTextTitle}>Quantity: </Text> 
                                                <Text style={defaultCSS.ModalTextTitle2}>{p.quantity}</Text>
                                            </View>
                                            <View style={defaultCSS.ModalFontContainer}>
                                                <Text style={defaultCSS.ModalTextTitle}>Notes: </Text> 
                                                <Text style={defaultCSS.ModalTextTitle2}>{p.notes}</Text>
                                            </View>
                                        </View>
                                        ))}
                                    </ScrollView>

                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                                        <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryGreyHex, width:"45%"}]} onPress={() => setShowSummary(false)}>
                                            <Text style={AddItemScreenCSS.ButtonText}>Close</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[AddItemScreenCSS.Button, { backgroundColor: modalAction === "reject" ? COLORS.primaryRedHex : COLORS.primaryGreenHex, width:"45%"}]}
                                            onPress={() => {
                                                setShowSummary(false);
                                                processNextStep(
                                                    requester,
                                                    category,
                                                    movementType,
                                                    receiveFrom,
                                                    deliverTo,
                                                    purpose,
                                                    remark,
                                                    products,
                                                    attachments,
                                                    modalAction == "reject" ? "reject" : "yes",
                                                );
                                            }}
                                        >
                                            <Text style={AddItemScreenCSS.ButtonText}>{modalAction === "reject" ? "Reject" : "Confirm"}</Text>
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