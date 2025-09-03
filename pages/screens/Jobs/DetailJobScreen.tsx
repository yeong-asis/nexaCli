import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Checkbox, Menu, TextInput } from "react-native-paper";
import { AddItemScreenCSS, defaultCSS, LoginManagementCSS, SignatureCSS } from '../../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS } from '../../../themes/theme';
import HeaderBar from '../../functions/HeaderBar';
import { useRoute } from '@react-navigation/native';
import { sampleJobs } from '../../../objects/SampleJsonData';
import { launchCamera, launchImageLibrary, Asset, ImageLibraryOptions } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SignatureCanvas, { SignatureViewRef } from 'react-native-signature-canvas';
import Snackbar from 'react-native-snackbar';

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
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const refTechnician = useRef<SignatureViewRef>(null);
    const [signTechnician, setSignTechnician] = useState(null);
    const refCustomer = useRef<SignatureViewRef>(null);
    const [signCustomer, setSignCutomer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSignature = (signature: any, type: any) => {
        if(type=="technician"){
            console.log('Signature captured:', signature);
            setSignTechnician(signature);
            Snackbar.show({
                text: "Technician signature saved",
                duration: Snackbar.LENGTH_SHORT,
            });
        }else{
            console.log('Signature captured:', signature);
            setSignCutomer(signature);
            Snackbar.show({
                text: "Customer signature saved",
                duration: Snackbar.LENGTH_SHORT,
            });
        }
        
    };

    const handleReSign = (type: any) => {
        if(type=="technician"){
            setSignTechnician(null);
        }else {
            setSignCutomer(null);
        }
    };

    const SubmitToAPI = async () => {
        Snackbar.show({
            text: "Submit",
            duration: Snackbar.LENGTH_LONG,
        });
    }

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
                        scrollEnabled={scrollEnabled}
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

                                <View style={{flexDirection: "column", marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Signature of Technician:</Text>
                                        <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                    </View>
                                    {signTechnician ? (
                                        // ===== Saved signature view =====
                                        <View style={{ height: 200 }} pointerEvents="box-only">
                                            <Image
                                                resizeMode="contain"
                                                style={{ width: 335, height: 114, backgroundColor: '#F8F8F8' }}
                                                source={{ uri: signTechnician }}
                                            />
                                            <Button title="Re-sign" onPress={() => handleReSign("technician")} />
                                        </View>
                                    ) : (
                                        // ===== Signature pad view =====
                                        <View style={{ height: 200 }} pointerEvents="box-only">
                                            <SignatureCanvas
                                                ref={refTechnician}
                                                onOK={(sig) => handleSignature(sig, "technician")}
                                                onBegin={() => setScrollEnabled(false)}
                                                onEnd={() => setScrollEnabled(true)}
                                                webStyle={SignatureCSS}
                                                style={{ flex: 1 }}
                                            />
                                        </View>
                                    )}
                                </View>

                                <View style={{flexDirection: "column", marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Signature of Customer:</Text>
                                        <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                    </View>
                                    {signCustomer ? (
                                        // ===== Saved signature view =====
                                        <View style={{ height: 200 }} pointerEvents="box-only">
                                            <Image
                                                resizeMode="contain"
                                                style={{ width: 335, height: 114, backgroundColor: '#F8F8F8' }}
                                                source={{ uri: signCustomer }}
                                            />
                                            <Button title="Re-sign" onPress={() => handleReSign("customer")} />
                                        </View>
                                    ) : (
                                        // ===== Signature pad view =====
                                        <View style={{ height: 200 }} pointerEvents="box-only">
                                            <SignatureCanvas
                                                ref={refCustomer}
                                                onOK={(sig) => handleSignature(sig, "customer")}
                                                onBegin={() => setScrollEnabled(false)}
                                                onEnd={() => setScrollEnabled(true)}
                                                webStyle={SignatureCSS}
                                                style={{ flex: 1 }}
                                            />
                                        </View>
                                    )}
                                </View>
                                <View style={{flexDirection: "row", justifyContent: 'space-around'}}>
                                    <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.secondaryLightGreyHex, width:"45%"}]} onPress={() => {console.log("Pause")}}>
                                        <Text style={AddItemScreenCSS.ButtonText}> Pause </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[AddItemScreenCSS.Button, {backgroundColor: COLORS.primaryOrangeHex, width:"45%"}]} onPress={() => {console.log("Done")}}>
                                        <Text style={AddItemScreenCSS.ButtonText}> Done </Text>
                                    </TouchableOpacity>
                                </View>
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