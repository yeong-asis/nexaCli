import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Checkbox, Menu, TextInput } from "react-native-paper";
import { AddItemScreenCSS, defaultCSS, LoginManagementCSS } from '../../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS } from '../../../themes/theme';
import HeaderBar from '../../functions/HeaderBar';

const AddJobScreen = ({ navigation }: { navigation: any }) => {
    const [processData, setProcessData] = useState(false);
    // const [selectedType, setSelectedType] = useState("Pending");

    const [title, setTitle] = useState("");
    const [titleHelperText, settitleHelperText] = useState(false);

    const [project, setProject] = useState("");
    const [projectMenuVisible, setProjectMenuVisible] = useState(false);
    const projectOptions = ['Salesmate', 'ActiveCampaign', 'Insightly'];

    const [startDate, setStartDate] = useState(new Date().toDateString());
    const [startDateTouched, setStartDateTouched] = useState(false);

    const [priority, setPriority] = useState("");
    const [assignedTo, setAssignedTo] = useState("");

    const [selectedPersons, setSelectedPersons] = useState<string[]>([]);
    const [showPersonPicker, setShowPersonPicker] = useState(false);
    const availablePersons = ["Alice", "Bob", "Charlie", "David"];

    const [description, setDescription] = useState("");

    // IOS Picker controls
    const [showIOSStartPicker, setShowIOSStartPicker] = useState(false)
    const [showIOSEndPicker, setShowIOSEndPicker] = useState(false)

    useEffect(() => {
        (async () => {
            
        })();
    }, []);

    const showAndroidDateTimePicker = (type: any) => {
        DateTimePickerAndroid.open({
            value: new Date(startDate),
            // value: type == "start" ? new Date(startDate) : new Date(endDate),
            onChange: (_event, date) => {
                if (!date) return; // user cancelled
                // store back in the same `toDateString()` format
                const formatted = date.toDateString();
                if (type === "start") {
                    console.log("Picked new startDate:", formatted);
                    setStartDate(formatted);
                } else {
                    console.log("Picked new endDate:", formatted);
                }
            },
            mode: "date"
        });
    }

    return (
        <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />
            
            <View style={{ flex: 1 }}>
                <HeaderBar title={`Add New Job: `} checkBackBttn={true} />
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
                                        <Text style={AddItemScreenCSS.TextInputFont}>Title:</Text>
                                        <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        value={title}
                                        // placeholder="Title"
                                        onChangeText={setTitle}
                                        returnKeyType="next"
                                        // onSubmitEditing={() => projectRef.current?.focus()}
                                    />
                                    {titleHelperText && <Text style={{ color: 'red', marginTop: 5 }}>Title can't be empty</Text>}
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                                    <View style={{ flex: 1, marginRight: 10 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Job Type:</Text>
                                            <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                        </View>
                                        <TextInput
                                            label=""
                                            mode="outlined"
                                            value={title}
                                            onChangeText={setTitle}
                                            returnKeyType="next"
                                            // onSubmitEditing={() => projectRef.current?.focus()}
                                        />
                                        {titleHelperText && <Text style={{ color: 'red', marginTop: 5 }}>Title can't be empty</Text>}
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Report:</Text>
                                            <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                        </View>
                                        <Menu
                                            visible={projectMenuVisible}
                                            onDismiss={() => setProjectMenuVisible(false)}
                                            anchor={
                                            <TouchableOpacity onPress={() => setProjectMenuVisible(true)}>
                                                <TextInput
                                                label=""
                                                mode="outlined"
                                                value={project}
                                                editable={false}
                                                pointerEvents="none"
                                                right={<TextInput.Icon icon="menu-down" onPress={() => setProjectMenuVisible(true)} />}
                                                />
                                            </TouchableOpacity>
                                            }
                                        >
                                            {projectOptions.map((option) => (
                                            <Menu.Item
                                                key={option}
                                                onPress={() => {
                                                    setProject(option);
                                                    setProjectMenuVisible(false);
                                                }}
                                                title={option}
                                            />
                                            ))}
                                        </Menu>
                                    </View>
                                </View>

                                {/* Start Date */}
                                <View style={{flexDirection: "column", marginTop: 10}}>
                                    <View style={AddItemScreenCSS.labelRow}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Start Date:</Text>
                                        <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                    </View>
                                    
                                    <TouchableOpacity 
                                        onPress={() => {Platform.OS === "android" ? showAndroidDateTimePicker("start") : setShowIOSStartPicker(true)}}
                                    >
                                        <TextInput
                                            label=""
                                            value={startDate}
                                            mode="outlined"
                                            editable={false}
                                            placeholder="Tap to select start date"
                                            right={
                                                <TextInput.Icon icon="calendar" onPress={() => {
                                                    Platform.OS === "android" ? showAndroidDateTimePicker("start") : setShowIOSStartPicker(true)
                                                }} />
                                            }
                                            error={startDateTouched && !startDate}
                                        />
                                    </TouchableOpacity>
                                    
                                    {startDateTouched && !startDate && (
                                        <Text style={AddItemScreenCSS.errorText}>Start Date is required</Text>
                                    )}
                                </View>

                                {/* Assign to and Priority in one row */}
                                <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                                    {/* Assign Input */}
                                    <View style={{ flex: 1, marginRight: 10 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Assigned To:</Text>
                                            <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                        </View>
                                        <TextInput
                                            label=""
                                            mode="outlined"
                                            value={assignedTo}
                                            onChangeText={setAssignedTo}
                                        />
                                    </View>

                                    {/* Priority Input */}
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                            <Text style={AddItemScreenCSS.TextInputFont}>Priority:</Text>
                                            <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                        </View>
                                        <TextInput
                                            label=""
                                            mode="outlined"
                                            value={priority}
                                            onChangeText={setPriority}
                                        />
                                    </View>
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
                                        style={{ textAlignVertical: 'top', height: 100 }} // Ensures text starts from top-left
                                        placeholder="Enter task description here"
                                    />
                                </View>


                                <TouchableOpacity style={AddItemScreenCSS.Button} onPress={() => {console.log("Done")}}>
                                    <Text style={AddItemScreenCSS.ButtonText}> Create </Text>
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
                                mode="date"
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
                        <Modal
                            visible={showPersonPicker}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={() => setShowPersonPicker(false)}
                        >
                            <TouchableWithoutFeedback onPress={() => setShowPersonPicker(false)}>
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                padding: 20
                            }}>
                                <TouchableWithoutFeedback>
                                <View style={{
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                    padding: 20,
                                }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Select Responsible Person</Text>
                                    <ScrollView style={{ maxHeight: 200 }}>
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
                                            onPress={() => {
                                                const allSelected = selectedPersons.length === availablePersons.length;
                                                setSelectedPersons(allSelected ? [] : [...availablePersons]);
                                            }}
                                            >
                                            <View style={AddItemScreenCSS.CheckboxCSS}>
                                                <Checkbox
                                                    status={
                                                    selectedPersons.length === availablePersons.length
                                                        ? 'checked'
                                                        : selectedPersons.length > 0
                                                        ? 'indeterminate'
                                                        : 'unchecked'
                                                    }
                                                    onPress={() => {
                                                    const allSelected = selectedPersons.length === availablePersons.length;
                                                    setSelectedPersons(allSelected ? [] : [...availablePersons]);
                                                    }}
                                                />
                                            </View>
                                            <Text style={{ marginLeft: 8 }}>Select All</Text>
                                        </TouchableOpacity>
                                        {availablePersons.map((person) => (
                                            <TouchableOpacity
                                                key={person}
                                                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
                                                onPress={() => {
                                                    if (selectedPersons.includes(person)) {
                                                        setSelectedPersons(prev => prev.filter(p => p !== person));
                                                    } else {
                                                        setSelectedPersons(prev => [...prev, person]);
                                                    }
                                            }}>
                                                <View style={AddItemScreenCSS.CheckboxCSS}>
                                                    <Checkbox
                                                        status={selectedPersons.includes(person) ? 'checked' : 'unchecked'}
                                                        onPress={() => {
                                                            if (selectedPersons.includes(person)) {
                                                            setSelectedPersons(prev => prev.filter(p => p !== person));
                                                            } else {
                                                            setSelectedPersons(prev => [...prev, person]);
                                                            }
                                                        }}
                                                    />
                                                </View>
                                                <Text style={{ marginLeft: 8 }}>{person}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>

                                    <TouchableOpacity
                                        style={{
                                            marginTop: 20,
                                            backgroundColor: COLORS.primaryDarkGreyHex,
                                            padding: 10,
                                            borderRadius: 8,
                                            alignItems: 'center'
                                        }}
                                        onPress={() => setShowPersonPicker(false)}
                                    >
                                        <Text style={{ color: 'white' }}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                                </TouchableWithoutFeedback>
                            </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}
export default AddJobScreen;