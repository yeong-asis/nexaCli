import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { WorkflowProps } from '../objects';
import { COLORS } from '../../themes/theme';


const StockListCard: React.FC<WorkflowProps> = ({
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
    const newFormatDate = new Date(createdDate).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <View style={[styles.CardContainer, {}]}>
            <View style={{flexDirection: "row"}}>
                <View style={{flexDirection: "column", width: "60%",}}>
                    <Text style={[styles.TextTitle, {width: "100%",}]}>{code}</Text>
                    <Text style={[styles.TextDescription, {}]} numberOfLines={2}>{newFormatDate}</Text>
                </View>
                <View style={{width: "40%", alignSelf: "flex-start", marginTop: 5, paddingRight: 5}}>

                    <Text style={[styles.TextStatus, {
                        width: 110,
                        textAlign: "center",
                        backgroundColor: status=="New" 
                            ? COLORS.secondaryLightGreyHex
                            : status=="Completed"
                                ? COLORS.primaryGreenHex
                                : status=="Pending"
                                    ? COLORS.primaryOrangeHex
                                    : status=="Validated"
                                        ? COLORS.primaryYellowHex
                                        : COLORS.primaryRedHex
                    }]}>
                        {status}
                    </Text>

                    {movementType!="" ? (
                        <Text style={[styles.TextTitle, {width: "100%", textAlign: "right", fontSize: 14, paddingRight: 15,}]}>
                            <Text style={{fontSize: 12, color: COLORS.primaryLightGreyHex}}>
                                {"Type: "}
                            </Text>
                            {movementType}
                        </Text>
                    ) : (
                        <></>
                    )}
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

export default StockListCard;
