import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { IPAddress, TaskProps } from '../../../objects/objects';
import TaskListCard from '../../../objects/Cards/TaskListCard';
import { AddItemScreenCSS, ButtonCSS, defaultCSS } from '../../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS, HEADERBACKGROUNDCOLORCODE } from '../../../themes/theme';
import HeaderBar from '../../functions/HeaderBar';
import LoadingAnimation from '../../functions/LoadingAnimation';
import EmptyListContainer from '../../functions/EmptyListContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SampleTask, sampleTaskData } from '../../../objects/SampleJsonData';
import Snackbar from 'react-native-snackbar';

const TaskListScreen = ({ navigation }: { navigation: any }) => {
    const [processData, setProcessData] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Pending");

    const [fetchedData, setFetchedData] = useState<TaskProps[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        (async () => {
            await fetchedDataAPI(selectedCategory);
        })();
    }, []);

    const fetchedDataAPI = async(requestStatus: any) => {
        setProcessData(true);
        setFetchedData([]);
        let runURL;
        const getUserID = await AsyncStorage.getItem('UserID') ?? "";

        if(requestStatus=="Pending"){
            runURL = `${IPAddress}/api/dashboard/tasks/pending?userId=${getUserID}`;
        }else{
            runURL = `${IPAddress}/api/dashboard/tasks/approval?userId=${getUserID}`;
        }

        try {
            // await axios.get( runURL ).then(async response => {
                
            //     const responseData=response.data;
                
                const responseData = sampleTaskData;
                console.log(responseData)

                const formattedMessages = responseData.map((item: any) => {
                    return {
                        pkkey: item.pkkey,
                        code: item.code,
                        title: item.title,
                        status: item.status,
                        type: item.type,
                    };
                });

                if(formattedMessages.length>0){
                    setFetchedData(formattedMessages);
                }
                setProcessData(false);
                
            // }).catch(error => {
            //     setProcessData(false);
            //     console.log(error);
            // });

        }catch (error: any) {
            setProcessData(false);
            console.log("Error: "+error);
        }
    };

    const onAddButtonPress = () => {
        navigation.navigate("AddTask");
    }

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(async () => {
            await fetchedDataAPI(selectedCategory);
        }, 1000);
        setRefreshing(false);
    };

    const showMessageCard = ({ item }: { item: TaskProps }) => {
        return (
            <TouchableOpacity onPress={() => {
                navigation.navigate('DetailTask', {
                    key: item.pkkey, 
                    code: item.code,
                });
            }} >
                <TaskListCard 
                    pkkey={item.pkkey}
                    title={item.title}
                    code={item.code}
                    status={item.status}
                    type={selectedCategory}/>
            </TouchableOpacity>
        );
    };

    return (
        <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />
            
            <View style={{ flex: 1 }}>
                <HeaderBar title={`Task: `} checkBackBttn={true} />
                <View style={defaultCSS.LineContainer}></View>

                <View style={{justifyContent: "flex-start", flex: 0.08}}>
                    <View style={ButtonCSS.SegmentedContainer}>
                        <Pressable 
                            style={[ButtonCSS.SegmentedButton, {
                                borderTopLeftRadius: 20, 
                                borderBottomLeftRadius: 20, 
                                backgroundColor: selectedCategory=="Pending" ? HEADERBACKGROUNDCOLORCODE : COLORS.primaryWhiteHex
                            }]}
                            onPress={()=> {
                                setSelectedCategory("Pending");
                                fetchedDataAPI("Pending");
                            }}
                        >
                            <Text style={[ButtonCSS.SegmentedText, {color: selectedCategory=="Pending" ? COLORS.primaryWhiteHex : COLORS.primaryGreyHex}]}>Pending</Text>
                        </Pressable>
                        <Pressable 
                            style={[ButtonCSS.SegmentedButton, {
                                borderTopRightRadius: 20, 
                                borderBottomRightRadius: 20, 
                                backgroundColor: selectedCategory=="Approval" ? HEADERBACKGROUNDCOLORCODE : COLORS.primaryWhiteHex
                            }]}
                            onPress={()=> {
                                setSelectedCategory("Approval");
                                fetchedDataAPI("Approval");
                            }}
                        >
                            <Text style={[ButtonCSS.SegmentedText, {color: selectedCategory=="Approval" ? COLORS.primaryWhiteHex : COLORS.primaryGreyHex}]}>Completed</Text>
                        </Pressable>
                    </View>
                </View>

                {processData ? (
                    <View style={{ alignSelf: "center", flex: 0.92, }}>
                        <LoadingAnimation />
                    </View>
                ) : (
                    (selectedCategory=="Pending") ? (
                        ( fetchedData.length>0 ) ? (
                            <View style={{flex: 0.92}}>
                                <FlatList
                                    data={fetchedData}
                                    renderItem={showMessageCard}
                                    removeClippedSubviews={false}
                                    refreshControl={<RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />}
                                />
                                <TouchableOpacity style={[AddItemScreenCSS.Button, {width:"55%", marginBottom: 20}]} onPress={() => { 
                                    Snackbar.show({
                                        text: 'Close all task',
                                        duration: Snackbar.LENGTH_LONG,
                                    });
                                }}>
                                    <Text style={AddItemScreenCSS.ButtonText}> Close Today Case </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{alignItems:"center", justifyContent: "center", flex: 0.9,}}>
                                <EmptyListContainer title={'No Task now.'} />
                            </View>
                        )
                    ) : (
                        ( fetchedData.length>0 ) ? (
                            <View style={{flex: 0.92}}>
                                <FlatList
                                    data={fetchedData}
                                    renderItem={showMessageCard}
                                    removeClippedSubviews={false}
                                    refreshControl={<RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />}
                                />
                            </View>
                        ) : (
                            <View style={{alignItems:"center", justifyContent: "center", flex: 0.9}}>
                                <EmptyListContainer title={'No Task now.'} />
                            </View>
                        )
                    )
                )}
                <TouchableOpacity
                    style={ButtonCSS.plusButton}
                    onPress={onAddButtonPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="add" size={28} color={COLORS.primaryWhiteHex} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default TaskListScreen;