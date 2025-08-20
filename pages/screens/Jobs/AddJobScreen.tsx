import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Checkbox, Menu, TextInput } from "react-native-paper";
import { AddItemScreenCSS, defaultCSS, LoginManagementCSS } from '../../../themes/CSS';
import { BACKGROUNDCOLORCODE, COLORS } from '../../../themes/theme';
import HeaderBar from '../../functions/HeaderBar';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Snackbar from 'react-native-snackbar';
import Geolocation from "react-native-geolocation-service";
import LoadingAnimation from '../../functions/LoadingAnimation';
import LoadingOverlay from '../../functions/LoadingOverlay';
import { IPAddress, SelectionItem } from '../../../objects/objects';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddJobScreen = ({ navigation }: { navigation: any }) => {
    const [processData, setProcessData] = useState(false);
    // const [selectedType, setSelectedType] = useState("Pending");

    const [requester, setRequester] = useState("");
    const [requesterName, setRequesterName] = useState("");
    const [requesterOptions, setRequesterOptions] = useState<SelectionItem[]>([]);

    const [customer, setCustomer] = useState("");
    const [customerName, setCustomerName] = useState('');
    const [customerOptions, setCustomerOptions] = useState<SelectionItem[]>([]);

    const [site, setSite] = useState("");
    const [siteHelperText, setSiteHelperText] = useState(false);

    const [address, setAddress] = useState("");
    const [addressHelperText, setAddressHelperText] = useState(false);
    const [loadLocation, setLoadLocation] = useState(false);

    const [title, setTitle] = useState("");
    const [titleHelperText, settitleHelperText] = useState(false);

    const [project, setProject] = useState("");
    const [projectName, setProjectName] = useState("");
    const projectOptions = [
        {'pkkey':'1','name':'Salesmate'}, 
        {'pkkey':'2','name':'ActiveCampaign'}, 
        {'pkkey':'3','name':'Insightly'}
    ];

    const [startDate, setStartDate] = useState(new Date().toLocaleString());
    const [startDateTouched, setStartDateTouched] = useState(false);

    const [priority, setPriority] = useState("");

    const [selectedPersons, setSelectedPersons] = useState<string[]>([]);
    const [showPersonPicker, setShowPersonPicker] = useState(false);
    const availablePersons = ["Alice", "Bob", "Charlie", "David"];

    const [description, setDescription] = useState("");

    // IOS Picker controls
    const [showIOSStartPicker, setShowIOSStartPicker] = useState(false)
    const [showIOSEndPicker, setShowIOSEndPicker] = useState(false)

    useEffect(() => {
        (async () => {
            const getUserID = await AsyncStorage.getItem('UserID') ?? "";
            setRequester(getUserID);
            await fetchedSelectionAPI(getUserID);
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

    const fetchedSelectionAPI = async(selectedUser: any) => {
        setProcessData(true);

        try {
            // user list
            await axios.get( 
                `${IPAddress}/api/dashboard/getUser` 
            ).then(async response => {
                
                const responseData=response.data;
                setRequesterOptions(responseData);

                const user = responseData.find((u: any) => u.pkkey === selectedUser);
                setRequesterName(user?.name ?? '');
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            // customer list
            await axios.get( 
                `${IPAddress}/api/dashboard/getCustomer` 
            ).then(async response => {
                
                const responseData=response.data;
                console.log("Customer List: "+responseData)
                setCustomerOptions(responseData);
                
            }).catch(error => {
                setProcessData(false);
                console.log(error);
            });

            setProcessData(false);

        }catch (error: any) {
            setProcessData(false);
            if (error.response) {
                console.log("Server responded:", error.response.data);
            } else if (error.request) {
                console.log("No response received:", error.request);
            } else {
                console.log("Axios error:", error.message);
            }
        }
    };

    const getCurrentAddress = async () => {
        try {
            setLoadLocation(true);

            // 1. Request permission
            let permission =
                Platform.OS === "ios"
                    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

            let result = await request(permission);
            if (result !== RESULTS.GRANTED) {
                Snackbar.show({
                    text: "Location permission denied",
                    duration: Snackbar.LENGTH_SHORT,
                });
                setLoadLocation(false);
                return;
            }

            // 2. Get current location
            Geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;

                    // 3. Reverse geocode into human-readable address
                    const addr = await reverseGeocode(latitude, longitude);

                    setAddress(addr);
                    setLoadLocation(false);
                },
                (error) => {
                    console.log(error);
                    Snackbar.show({
                        text: "Error getting location",
                        duration: Snackbar.LENGTH_SHORT,
                    });
                    setLoadLocation(false);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        } catch (err) {
            console.error("Error:", err);
            setLoadLocation(false);
        }
    };

    const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
                {
                    headers: {
                        "User-Agent": "YourAppName/1.0 (your@email.com)", // Nominatim requires this
                        "Accept": "application/json"
                    }
                }
            );

            // Check content-type to avoid HTML parse error
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Invalid response from geocoding service");
            }

            const data = await response.json();
            return data.display_name || `${lat}, ${lon}`;
        } catch (err) {
            console.error("Reverse geocode failed:", err);
            return `${lat}, ${lon}`; // fallback to coordinates
        }
    };



    return (
        <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />
            
            <View style={{ flex: 1 }}>
                <HeaderBar title={`Add New Job: `} checkBackBttn={true} />
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
                                padding: 20, 
                                backgroundColor: COLORS.primaryWhiteHex,            
                                borderRadius: 16,
                                overflow: 'hidden',
                            }]}>
                                <View style={{flexDirection: "column", marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Customer:</Text>
                                        <Text style={AddItemScreenCSS.asterisk}>*</Text>
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
                                        data={customerOptions}
                                        search
                                        searchPlaceholder="Search customer..."
                                        labelField="name"
                                        valueField="pkkey"
                                        placeholder={customerName || 'Select customer'}
                                        value={customer}
                                        onChange={item => {
                                            setCustomer(item.pkkey);
                                            setCustomerName(item.name);
                                        }}
                                        // performance tweaks:
                                        maxHeight={300}
                                        flatListProps={{
                                            initialNumToRender: 20,
                                            windowSize: 10,
                                        }}
                                    />
                                </View>
                                <View style={{flexDirection: "column", marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Site:</Text>
                                        <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                    </View>
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        value={site}
                                        // placeholder="Title"
                                        onChangeText={setSite}
                                        returnKeyType="next"
                                        // onSubmitEditing={() => projectRef.current?.focus()}
                                    />
                                    {siteHelperText && <Text style={{ color: 'red', marginTop: 5 }}>Site can't be empty</Text>}
                                </View>
                                <View style={{flexDirection: "column", marginTop: 10}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                        <Text style={AddItemScreenCSS.TextInputFont}>Address:</Text>
                                        <Text style={AddItemScreenCSS.asterisk}>*</Text>
                                    </View>
                                    {loadLocation ? (
                                    <View style={{ alignSelf: "center", flex: 0.92, }}>
                                        <LoadingOverlay />
                                    </View>
                                    ) : (
                                    <TextInput
                                        label=""
                                        mode="outlined"
                                        value={address}
                                        multiline
                                        numberOfLines={3}
                                        onChangeText={setAddress}
                                        returnKeyType="next"
                                        right={<TextInput.Icon icon="crosshairs-gps" onPress={getCurrentAddress} />}
                                        style={{ textAlignVertical: 'top', height: 100 }} 
                                        // onSubmitEditing={() => projectRef.current?.focus()}
                                    />
                                    )}
                                    {addressHelperText && <Text style={{ color: 'red', marginTop: 5 }}>Address can't be empty</Text>}
                                </View>
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
                                        <Dropdown
                                            style={[
                                                AddItemScreenCSS.dropdown,
                                            ]}
                                            placeholderStyle={AddItemScreenCSS.placeholderStyle}
                                            selectedTextStyle={AddItemScreenCSS.selectedTextStyle}
                                            inputSearchStyle={AddItemScreenCSS.inputSearchStyle}
                                            containerStyle={AddItemScreenCSS.listContainerStyle}
                                            activeColor={COLORS.primaryVeryLightGreyHex}
                                            data={projectOptions}
                                            search
                                            searchPlaceholder="Search Report..."
                                            labelField="name"
                                            valueField="pkkey"
                                            placeholder={projectName || 'Select Report'}
                                            value={project}
                                            onChange={item => {
                                                setProject(item.pkkey);
                                                setProjectName(item.name);
                                            }}
                                            // performance tweaks:
                                            maxHeight={300}
                                            flatListProps={{
                                                initialNumToRender: 20,
                                                windowSize: 10,
                                            }}
                                        />
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
                                        <Dropdown
                                            style={AddItemScreenCSS.dropdown}
                                            placeholderStyle={AddItemScreenCSS.placeholderStyle}
                                            selectedTextStyle={AddItemScreenCSS.selectedTextStyle}
                                            inputSearchStyle={AddItemScreenCSS.inputSearchStyle}
                                            containerStyle={AddItemScreenCSS.listContainerStyle}
                                            activeColor={COLORS.primaryVeryLightGreyHex}
                                            data={requesterOptions}
                                            search
                                            searchPlaceholder="Search Technician..."
                                            labelField="name"
                                            valueField="pkkey"
                                            placeholder={requesterName || 'Assign To'}
                                            value={requester}
                                            onChange={item => {
                                                setRequester(item.pkkey);
                                                setRequesterName(item.name);
                                            }}
                                            // performance tweaks:
                                            maxHeight={280}
                                            flatListProps={{
                                                initialNumToRender: 20,
                                                windowSize: 10,
                                            }}
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
                                mode="datetime"
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
                )}
            </View>
        </View>
    );
}
export default AddJobScreen;