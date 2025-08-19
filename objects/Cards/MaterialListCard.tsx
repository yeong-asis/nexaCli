import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { WorkflowProps } from '../objects';
import { COLORS } from '../../themes/theme';


const MaterialListCard: React.FC<WorkflowProps> = ({
    pkkey,
    code,
    description,
    status,
    totalAmount,
    currencyName,
    remark,
    requester,
    dueDate,
    productSeries,
    productStage,
    supplierName,
    movementType,
    debitAccount,
    shipping,
    getDate,
    createdDate,
}) => {
    // const newFormatDate = new Date(dueDate).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <View style={[styles.CardContainer, {}]}>
            <View style={{flexDirection: "row"}}>
                <View style={{flexDirection: "column", width: "60%",}}>
                    <Text style={[styles.TextTitle, {width: "100%",}]}>{code}</Text>
                    <Text style={[styles.TextDescription, {}]} numberOfLines={3}>{description}</Text>
                </View>
                <View style={{width: "40%", alignSelf: "flex-start", marginTop: 5, paddingRight: 5}}>

                    {currencyName!="" && totalAmount!="" ? (
                        <Text style={[styles.TextTitle, {width: "100%", textAlign: "right", fontSize: 14,}]}>{currencyName} {totalAmount}</Text>
                    ) : (
                        <></>
                    )}

                    <Text style={[styles.TextStatus, {
                        backgroundColor: status=="Pending" 
                            ? COLORS.secondaryLightGreyHex 
                                : status=="Approved" 
                                    ? COLORS.primaryGreenHex
                                    : status=="Rejected" 
                                        ? COLORS.primaryRedHex
                                        : COLORS.primaryOrangeHex
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
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
        textAlign: "left",
        textAlignVertical: "center",
        width: "80%",
    },
    TextDescription: {
        color: COLORS.primaryGreyHex,
        fontSize: 14,
        marginVertical: 5,
        textAlign: "left",
        textAlignVertical: "center",
        width: "80%",
    },
    TextStatus: {
        marginVertical: 5,
        textAlignVertical: "center",
        alignSelf: "flex-end", 
        textAlign: "right", 
        width: 'auto', 
        fontWeight: "bold", 
        fontSize: 16, 
        color: COLORS.primaryWhiteHex,
        borderWidth: 0.4, 
        borderRadius: 20, 
        paddingHorizontal: 15, 
        paddingVertical: 5
    },
});

export default MaterialListCard;
