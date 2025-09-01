import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Checkbox, Menu, TextInput } from "react-native-paper";
import { AddItemScreenCSS, defaultCSS, LoginManagementCSS } from '../../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS } from '../../../themes/theme';
import HeaderBar from '../../functions/HeaderBar';
import { Asset, ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { useRoute } from '@react-navigation/native';

const TaskDetailScreen = ({ navigation }: { navigation: any }) => {
    const route = useRoute();
        const { key, code } = route.params as any;
        
    const [processData, setProcessData] = useState(false);
    // const [selectedType, setSelectedType] = useState("Pending");

    const [title, setTitle] = useState("");
    const [titleHelperText, settitleHelperText] = useState(false);

    const [description, setDescription] = useState("");
    const [descriptionHelperText, setdescriptionHelperText] = useState(false);

    const [remark, setRemark] = useState("");
    const [remarkHelperText, setremarkHelperText] = useState(false);
    
    const [attachments, setAttachments] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            
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

    const editTask = async(title: any, description: any, remark: any) => {
        if(title==""){
            settitleHelperText(true);
        }else{
            settitleHelperText(false)
        }

        if(description==""){
            setdescriptionHelperText(true);
        }else{
            setdescriptionHelperText(false)
        }

        if(remark==""){
            setremarkHelperText(true);
        }else{
            setremarkHelperText(false)
        }

        console.log("Done")
    }


    return (
        <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />
            
            <View style={{ flex: 1 }}>
                <HeaderBar title={code} checkBackBttn={true} />
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
                                padding: 30, 
                                backgroundColor: COLORS.primaryWhiteHex,            
                                borderRadius: 16,
                                overflow: 'hidden',
                            }]}>
                                <View style={{flexDirection: "column", marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Title</Text>
                                        <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        value={title}
                                        onChangeText={setTitle}
                                        multiline
                                        numberOfLines={5}
                                        returnKeyType="next"
                                        style={{ textAlignVertical: 'top', height: 100 }}
                                        // onSubmitEditing={() => projectRef.current?.focus()}
                                        placeholder="Enter Title here"
                                    />
                                    {titleHelperText && <Text style={{ color: 'red', marginTop: 5 }}>Title can't be empty</Text>}
                                </View>

                                
                                <View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Description</Text>
                                        <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        multiline
                                        numberOfLines={5}
                                        value={description}
                                        onChangeText={setDescription}
                                        returnKeyType="next"
                                        style={{ textAlignVertical: 'top', height: 100 }}
                                        placeholder="Enter Description here"
                                    />
                                    {descriptionHelperText && <Text style={{ color: 'red', marginTop: 5 }}>Description can't be empty</Text>}
                                </View>


                                <View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Remark</Text>
                                        <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        multiline
                                        numberOfLines={5}
                                        value={remark}
                                        onChangeText={setRemark}
                                        returnKeyType="next"
                                        style={{ textAlignVertical: 'top', height: 100 }}
                                        placeholder="Enter Remark here"
                                    />
                                    {remarkHelperText && <Text style={{ color: 'red', marginTop: 5 }}>Reamrk can't be empty</Text>}
                                </View>

                                {/* ── Attach Files Section ──────────────────────────────────────── */}
                                <View style={{ marginTop: 16 }}>
                                    {/* (a) Button to open document picker */}
                                    <TouchableOpacity
                                        onPress={pickFiles}
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

                                <TouchableOpacity style={AddItemScreenCSS.Button} onPress={() => {editTask(title, description, remark)}}>
                                    <Text style={AddItemScreenCSS.ButtonText}> Edit </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}
export default TaskDetailScreen;