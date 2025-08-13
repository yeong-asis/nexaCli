import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Checkbox, Menu, TextInput } from "react-native-paper";
import { AddItemScreenCSS, defaultCSS, LoginManagementCSS } from '../../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS } from '../../../themes/theme';
import HeaderBar from '../../functions/HeaderBar';
import { useRoute } from '@react-navigation/native';
import { sampleJobs } from '../../../objects/SampleJsonData';
import { AttachmentsProps } from '../../../objects/objects';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const JobDetailScreen = ({ navigation }: { navigation: any }) => {
    const [processData, setProcessData] = useState(false);
    const route = useRoute();
    const { key, code } = route.params as any;

    const [customer, setCustomer] = useState("");
    const [site, setSite] = useState("");
    const [address, setAddress] = useState("");
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState(new Date().toDateString());
    const [description, setDescription] = useState("");

    const [issue, setIssue] = useState("");
    const [reason, setReason] = useState("");
    const [action, setAction] = useState("");
    const [attachments, setAttachments] = useState<any[]>([]);
    // const [currentAttachment, setCurrentAttachment] = useState<AttachmentsProps[]>([]);

    // IOS Picker controls
    const [showIOSStartPicker, setShowIOSStartPicker] = useState(false)
    const [showIOSEndPicker, setShowIOSEndPicker] = useState(false)

    useEffect(() => {
        (async () => {
            await fetchedDataAPI();
        })();
    }, []);

    const showAndroidDateTimePicker = (type: string) => {
        // Step 1: Pick date
        DateTimePickerAndroid.open({
            value: new Date(),
            onChange: (_event, date) => {
                if (!date) return;
    
                // Step 2: Pick time
                DateTimePickerAndroid.open({
                    value: date,
                    mode: "time",
                    is24Hour: true,
                    display: 'spinner',
                    onChange: (_event2, time) => {
                        if (!time) return;
                        const combined = new Date(date);
                        combined.setHours(time.getHours());
                        combined.setMinutes(time.getMinutes());
                        setStartDate(combined.toLocaleString()); // full date + time
                    },
                });
            },
            mode: "date"
        });
    };

    const fetchedDataAPI = async() => {
        setProcessData(true);
        const job = sampleJobs.find(j => j.pkkey === key);
        if (job) {
            setCustomer(job.customerName);
            setSite(job.siteName);
            setAddress(job.address);
            setTitle(job.title);
            setDescription(job.description);
            setStartDate(job.startDate);
        }
        setProcessData(false);
    }

    const pickFiles = async () => {
        
    };

    return (
        <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />
            
            <View style={{ flex: 1 }}>
                <HeaderBar title={`${code}`} checkBackBttn={true} />
                <View style={defaultCSS.LineContainer}></View>

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
                                padding: 20, 
                                backgroundColor: COLORS.primaryWhiteHex,            
                                borderRadius: 16,
                                overflow: 'hidden',
                            }]}>
                                <View style={{flexDirection: "column", marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Customer: {customer}</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: "column", marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Site: {site}</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: "column", marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Address: {address}</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: "column", marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Start Date & Time: {startDate}</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: "column", marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Desc: {description}</Text>
                                    </View>
                                </View>

                                <View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Issue</Text>
                                        <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        multiline
                                        numberOfLines={5}
                                        value={issue}
                                        onChangeText={setIssue}
                                        style={{ textAlignVertical: 'top', height: 100 }} // Ensures text starts from top-left
                                        placeholder="Enter issue here"
                                    />
                                </View>

                                <View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Reason</Text>
                                        <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        multiline
                                        numberOfLines={5}
                                        value={reason}
                                        onChangeText={setReason}
                                        style={{ textAlignVertical: 'top', height: 100 }} // Ensures text starts from top-left
                                        placeholder="Enter reason here"
                                    />
                                </View>

                                <View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Action</Text>
                                        <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        multiline
                                        numberOfLines={5}
                                        value={action}
                                        onChangeText={setAction}
                                        style={{ textAlignVertical: 'top', height: 100 }} // Ensures text starts from top-left
                                        placeholder="Enter action here"
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

                                

                                <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.secondaryLightGreyHex}]} onPress={() => {console.log("Pause")}}>
                                    <Text style={AddItemScreenCSS.ButtonText}> Pause </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryOrangeHex}]} onPress={() => {console.log("Done")}}>
                                    <Text style={AddItemScreenCSS.ButtonText}> Done </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {Platform.OS == "ios" && (
                            <>
                            <DateTimePickerModal
                                isVisible={showIOSStartPicker}
                                mode="date"
                                onConfirm={(date) => {
                                    const formatted = date.toDateString();
                                    setStartDate(formatted);
                                    setShowIOSStartPicker(false);
                                }}
                                onCancel={() => setShowIOSStartPicker(false)}
                                minimumDate={new Date()}
                            />
                            <DateTimePickerModal
                                isVisible={showIOSEndPicker}
                                mode="datetime"
                                onConfirm={(date) => {
                                    const formatted = date.toDateString();
                                    setStartDate(formatted);
                                    setShowIOSEndPicker(false);
                                }}
                                onCancel={() => setShowIOSEndPicker(false)}
                                minimumDate={new Date()}
                            />
                            </>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}
export default JobDetailScreen;