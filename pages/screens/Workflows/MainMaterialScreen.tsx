import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StatusBar, TouchableOpacity, View } from "react-native";
import { IPAddress, WorkflowProps } from '../../../objects/objects';
import MaterialListCard from '../../../objects/Cards/MaterialListCard';
import { BACKGROUNDCOLORCODE, COLORS } from '../../../themes/theme';
import { ButtonCSS, defaultCSS } from '../../../themes/CSS';
import HeaderBar from '../../functions/HeaderBar';
import LoadingAnimation from '../../functions/LoadingAnimation';
import EmptyListContainer from '../../functions/EmptyListContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MaterialListScreen = ({ navigation }: { navigation: any }) => {
    const [processData, setProcessData] = useState(false);

    const [fetchedData, setFetchedData] = useState<WorkflowProps[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        (async () => {
            await fetchedDataAPI();
        })();
    }, []);

    const fetchedDataAPI = async() => {
        setProcessData(true);
        setFetchedData([]);

        const getUserID = await AsyncStorage.getItem('UserID') ?? "";

        try {
            await axios.get(
                `${IPAddress}/api/dashboard/materialReq?userId=${getUserID}`
            ).then(async response => {
                
                const responseData=response.data;
                
                // const responseData = SampleTask.taskList;
                // console.log(responseData)

                const formattedMessages = responseData.map((item: any) => {
                    return {
                        pkkey: item.pkkey,
                        code: item.code,
                        description: item.description,
                        status: item.status,
                        totalAmount: item.totalAmount,
                        currencyName: item.currencyName,
                        remark: item.remark,
                        requester: item.requester,
                        productSeries: item.productSeries,
                        productStage: item.productStage,
                        dueDate: item.dueDate,
                        supplierName: item.supplierName,
                        movementType: item.movementType,
                        debitAccount: item.debitAccount,
                        shipping: item.shipping,
                        getDate: item.getDate,
                        createdDate: item.createdDate,
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

    const onAddButtonPress = () => {
        navigation.navigate("AddMaterial");
    }

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(async () => {
            await fetchedDataAPI();
        }, 1000);
        setRefreshing(false);
    };

    const showWorkflowCard = ({ item }: { item: WorkflowProps }) => {
        return (
            <TouchableOpacity onPress={() => {
                navigation.navigate('DetailMaterial', {
                    key: item.pkkey, 
                });
            }} >
                <MaterialListCard 
                    pkkey={item.pkkey}
                    code={item.code}
                    description={item.description}
                    status={item.status}
                    totalAmount={item.totalAmount}
                    currencyName={item.currencyName}
                    remark={item.remark}
                    requester={item.requester}
                    productSeries={item.productSeries}
                    productStage={item.productStage}
                    dueDate={item.dueDate}
                    supplierName={item.supplierName}
                    movementType={item.movementType}
                    debitAccount={item.debitAccount} 
                    shipping={item.shipping}
                    getDate={item.getDate}     
                    createdDate={item.createdDate}         
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />
            
            <View style={{ flex: 1 }}>
                <HeaderBar title={`${"Material"}: `} checkBackBttn={true} />
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
                                refreshControl={<RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />}
                            />
                        </View>
                    ) : (
                        <View style={{alignItems:"center", justifyContent: "center", flex: 0.9,}}>
                            <EmptyListContainer title={'No Request now.'} />
                        </View>
                    )
                )}

                <TouchableOpacity
                    style={ButtonCSS.plusButton}
                    onPress={onAddButtonPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="add" size={44} color={COLORS.primaryWhiteHex} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default MaterialListScreen;