import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { IPAddress, JobProps } from '../../../objects/objects';
import JobListCard from '../../../objects/Cards/JobListCard';
import { ButtonCSS, defaultCSS } from '../../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS, HEADERBACKGROUNDCOLORCODE } from '../../../themes/theme';
import HeaderBar from '../../functions/HeaderBar';
import LoadingAnimation from '../../functions/LoadingAnimation';
import EmptyListContainer from '../../functions/EmptyListContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { sampleJobs } from '../../../objects/SampleJsonData';
import Snackbar from 'react-native-snackbar';

const JobListScreen = ({ navigation }: { navigation: any }) => {
    const [processData, setProcessData] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Pending");

    const [fetchedData, setFetchedData] = useState<JobProps[]>([]);
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
                
                const responseData = sampleJobs.filter(job => {
                    if (requestStatus === "Approval") {
                        return job.status.toLowerCase() === "completed";
                    } else {
                        return job.status.toLowerCase() !== "completed";
                    }
                });
                // const responseData=response.data;

                const formattedMessages = responseData.map((item: any) => {
                    return {
                        pkkey: item.pkkey,
                        code: item.code,
                        title: item.title,
                        status: item.status,
                        report: item.report,
                        startDate: item.startDate,
                        assignTo: item.assignTo,
                        priority: item.priority,
                        description: item.description,
                        customerID: item.customerID,
                        customerName: item.customerName,
                        siteID: item.siteID,
                        siteName: item.siteName,
                        address: item.address,
                        type: item.tyoe
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
        navigation.navigate("AddJob");
    }

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(async () => {
            await fetchedDataAPI(selectedCategory);
        }, 1000);
        setRefreshing(false);
    };

    const showMessageCard = ({ item }: { item: JobProps }) => {
        return (
            <TouchableOpacity onPress={() => {
                navigation.navigate('DetailJob', {
                    key: item.pkkey, 
                    code: item.code,
                });
            }} >
                <JobListCard 
                    pkkey={item.pkkey}
                    title={item.title}
                    code={item.code}
                    status={item.status}
                    type={selectedCategory}
                    report={item.report}
                    startDate={item.startDate}
                    assignTo={item.assignTo}
                    priority={item.priority}
                    description={item.description} 
                    customerID={item.customerID} 
                    customerName={item.customerName} 
                    siteID={item.siteID} 
                    siteName={item.siteName} 
                    address={item.address}/>
            </TouchableOpacity>
        );
    };

    return (
        <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />
            
            <View style={{ flex: 1 }}>
                <HeaderBar title={`Job: `} checkBackBttn={true} />
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
                            </View>
                        ) : (
                            <View style={{alignItems:"center", justifyContent: "center", flex: 0.9,}}>
                                <EmptyListContainer title={'No Job now.'} />
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
                                <EmptyListContainer title={'No Job now.'} />
                            </View>
                        )
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
export default JobListScreen;