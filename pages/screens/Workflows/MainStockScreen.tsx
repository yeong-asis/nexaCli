import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IPAddress, WorkflowProps } from '../../../objects/objects';
import { ButtonCSS, defaultCSS } from '../../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS } from '../../../themes/theme';
import HeaderBar from '../../functions/HeaderBar';
import LoadingAnimation from '../../functions/LoadingAnimation';
import EmptyListContainer from '../../functions/EmptyListContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StockListCard from '../../../objects/Cards/StockListCard';
import { sampleWorkflowData } from '../../../objects/SampleJsonData';
import Snackbar from 'react-native-snackbar';

const StockListScreen = ({ navigation }: { navigation: any }) => {
    const [processData, setProcessData] = useState(false);

    const [fetchedData, setFetchedData] = useState<WorkflowProps[]>([]);
    const [itemFinish, setItemFinish] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [itemPerPage, setItemPerPage] = useState<number>(10);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        (async () => {
            setProcessData(true);
            setFetchedData([]);
            await fetchedDataAPI(currentPage, itemPerPage);
        })();
    }, []);

    const fetchedDataAPI = async(page: number, pageSize: number) => {

        const getUserID = await AsyncStorage.getItem('UserID') ?? "";
        const getUserEmail = await AsyncStorage.getItem('Email') ?? "";
        const getUserPassword = await AsyncStorage.getItem('Password') ?? "";

        const request = {
            "APIAction": "GetSMQList",
            "UserID": getUserID,
            "PageSize": pageSize,
            "PageNumber": page
        }

        try {
            const response = await axios.post(
                "http://192.168.168.150/NEXA/api/StockMovement/Get",
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
                const formattedMessages = responseData.SMQList.map((item: any) => {
                    return {
                        pkkey: item.Id,
                        code: item.SMQCode,
                        statusID: item.StatusID,
                        status: item.Status,
                        remark: item.remark,
                        requesterID: item.requesterID,
                        RequesterName: item.RequesterName,
                        receiveFromID: item.receiveFromID,
                        receiveFromName: item.receiveFromName,
                        deliverToID: item.deliverToID,
                        deliverToName: item.deliverToName,
                        MovementType: item.MovementType,
                        MoveTypeName: item.MoveTypeName,
                        categoryID: item.Category,
                        categoryName: item.CategoryName,
                        NEXTPIC: item.NEXTPIC,
                        createdDate: item.CreatedOn,
                        SKIPValidator: item.SKIPValidator
                    };
                });

                if(formattedMessages.length == 0){
                    if(page==0){
                        setItemFinish(false);
                    }else{
                        setItemFinish(true);
                    }
                    setProcessData(false);
                }else{
                    setFetchedData((prevData) => [...prevData, ...formattedMessages]);
                    setItemFinish(false);
                    setProcessData(false);
                }
                    
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

    const onAddButtonPress = () => {
        navigation.navigate("AddStock");
    }

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(async () => {
            await fetchedDataAPI(0, itemPerPage);
        }, 1000);
        setRefreshing(false);
    };

    const loadMore = async () => {
        const passPage = currentPage + 1;
        setCurrentPage(passPage);
        await fetchedDataAPI(passPage, itemPerPage);
    }

    const showWorkflowCard = ({ item }: { item: WorkflowProps }) => {
        return (
            <TouchableOpacity onPress={() => {
                navigation.navigate('DetailStock', {
                    key: item.pkkey, 
                    code: item.code,
                    status: item.status
                });
            }} >
                <StockListCard
                    pkkey={item.pkkey}
                    code={item.code}
                    status={item.status}
                    statusID={item.statusID}
                    remark={item.remark}
                    createdDate={item.createdDate} 
                    requesterID={item.requesterID} 
                    RequesterName={item.RequesterName} 
                    receiveFromID={item.receiveFromID} 
                    receiveFromName={item.receiveFromName} 
                    deliverToID={item.deliverToID} 
                    deliverToName={item.deliverToName} 
                    MovementType={item.MovementType} 
                    MoveTypeName={item.MoveTypeName} 
                    categoryID={item.categoryID} 
                    categoryName={item.categoryName} 
                    NEXTPIC={item.NEXTPIC} 
                    SKIPValidator={item.SKIPValidator}             
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />
            
            <View style={{ flex: 1 }}>
                <HeaderBar title={`${"Stock Movement"}: `} checkBackBttn={true} />
                {/* <View style={defaultCSS.LineContainer}></View> */}

                {processData ? (
                    <View style={{ alignSelf: "center", flex: 0.92, }}>
                        <LoadingAnimation />
                    </View>
                ) : (
                    ( fetchedData.length>0 ) ? (
                        <View style={{flex: 1}}>
                            <FlatList
                                data={fetchedData}
                                renderItem={showWorkflowCard}
                                removeClippedSubviews={false}
                                onEndReached={loadMore}
                                refreshControl={<RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />}
                                ListFooterComponent={() => itemFinish && (
                                    <View style={styles.CardContainer}>
                                        <View>
                                            <Text style={[styles.TextTitle, { color: COLORS.secondaryLightGreyHex, fontSize: 16 }]}>No More Data</Text>
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    ) : (
                        <View style={{alignItems:"center", justifyContent: "center", flex: 0.9,}}>
                            <EmptyListContainer title={'No Stock Movement now.'} />
                        </View>
                    )
                )}
                <TouchableOpacity
                    style={ButtonCSS.plusButton}
                    onPress={onAddButtonPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="add" size={48} color={COLORS.primaryWhiteHex} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    CardContainer: {
        flexDirection: "column",
        width: Dimensions.get("screen").width, 
        borderWidth: 0.4,
        padding: 15,
        marginVertical: 0,
    },
    TextTitle: {
        color: COLORS.primaryBlackHex,
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
        textAlign: "left",
        textAlignVertical: "center",
        width: "80%",
    },
    TextDescription: {
        color: COLORS.primaryGreyHex,
        fontSize: 14,
        marginVertical: 5,
        textAlign: "left",
        textAlignVertical: "center",
        width: "80%",
    },
    TextStatus: {
        marginVertical: 5,
        textAlignVertical: "center",
        alignSelf: "flex-end", 
        textAlign: "right", 
        width: 'auto', 
        fontWeight: "bold", 
        fontSize: 16, 
        color: COLORS.primaryWhiteHex,
        borderWidth: 0.4, 
        borderRadius: 20, 
        paddingHorizontal: 15, 
        paddingVertical: 5
    },
});

export default StockListScreen;