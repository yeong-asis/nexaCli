import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { statusContainerColors, statusTextColors, WorkflowProps } from '../objects';
import { COLORS, HEADERBACKGROUNDCOLORCODE } from '../../themes/theme';
import { ChangeDateTime } from '../../pages/functions/StandardFunction';
import Ionicons from 'react-native-vector-icons/Ionicons';

const StockListCard: React.FC<WorkflowProps> = ({
    pkkey,
    code,
    status,
    RequesterName,
    categoryName,
    createdDate,
    isSelected = false,
    onToggleSelect,
}) => {
    return (
        <View style={[styles.CardContainer, {}]}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <TouchableOpacity onPress={onToggleSelect} style={{ marginRight: 12 }}>
                    <Ionicons
                        name={isSelected ? "checkbox" : "square-outline"}
                        size={26}
                        color={COLORS.primaryDarkGreyHex}
                    />
                </TouchableOpacity>
                
                <View style={{flexDirection: "column", width: "55%",}}>
                    <Text style={[styles.TextTitle, {width: "100%",}]}>{code}</Text>
                    <Text style={[styles.TextDescription, {}]}>{RequesterName}</Text>
                    <Text style={[styles.TextDescription2, {}]}>{categoryName}</Text>
                    <Text style={[styles.TextDescription2, {}]}>{ChangeDateTime(createdDate)}</Text>
                </View>
                
                <View style={{width: "38%", alignSelf: "flex-start", marginTop: 5, paddingRight: 5}}>
                    <View style={{flex: 1}}></View>
                    <Text style={[styles.TextStatus, {
                        width: 110,
                        textAlign: "center",
                        backgroundColor: statusContainerColors[status] || COLORS.primaryRedHex,
                        color: statusTextColors[status] || COLORS.primaryWhiteHex,
                    }]}>
                        {status}
                    </Text>
                </View>
            </View>
        </View>
    );
};

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
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
        textAlign: "left",
        textAlignVertical: "center",
        width: "80%",
    },
    TextDescription: {
        color: COLORS.primaryGreyHex,
        fontSize: 14,
        textAlign: "left",
        textAlignVertical: "center",
        width: "80%",
        fontWeight: "bold",
    },
    TextDescription2: {
        color: COLORS.primaryLightGreyHex,
        fontSize: 12,
        textAlign: "left",
        textAlignVertical: "center",
        width: "80%",
        fontWeight: "bold",
    },
    TextStatus: {
        marginVertical: 5,
        textAlignVertical: "bottom",
        alignSelf: "flex-end", 
        textAlign: "right", 
        fontWeight: "bold", 
        fontSize: 16, 
        color: COLORS.primaryWhiteHex,
        borderWidth: 1, 
        borderRadius: 8, 
        borderColor: "#CCC",
        paddingVertical: 6
    },
    TextStatus2: {
        flex: 1,
        marginVertical: 5,
        textAlignVertical: "bottom",
        alignSelf: "flex-end", 
        textAlign: "right", 
        width: 'auto', 
        fontWeight: "bold", 
        fontSize: 16, 
        color: HEADERBACKGROUNDCOLORCODE,
    },
});

export default StockListCard;
