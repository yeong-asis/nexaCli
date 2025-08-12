import React, { useEffect } from 'react';
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { defaultCSS } from '../../../themes/CSS';
import { BACKGROUNDCOLORCODE } from '../../../themes/theme';
import HeaderBar from '../../functions/HeaderBar';
import { WorkflowMenuItems } from '../../../objects/objects';

const WorkflowListScreen = ({ navigation }: { navigation: any }) => {

    useEffect(() => {
        (async () => {
            
        })();
    }, []);

    return (
        <View style={defaultCSS.ScreenContainer}>
            <StatusBar backgroundColor={BACKGROUNDCOLORCODE} />

            <View style={{ flex: 1 }}>
                <HeaderBar title={`Workflow: `} checkBackBttn={true} />
                <View style={defaultCSS.LineContainer}></View>

                <FlatList
                    contentContainerStyle={{ padding: 20 }}
                    data={WorkflowMenuItems}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                        onPress={() => {
                            if(item.navigate!=""){
                                navigation.navigate('MainMaterial', {
                                    key: "", 
                                });
                            }else{
                                console.log("empty navigation")
                            }
                        }}
                        style={defaultCSS.ListSelectionCSS}
                        >
                            <Text style={defaultCSS.ListTextCSS}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
}
export default WorkflowListScreen;