import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../themes/theme';
import { JobProps } from '../objects';

const JobListCard: React.FC<JobProps> = ({
    pkkey,
    title,
    status,
    type,
    report,
    startDate,
    assignTo,
    priority,
    description,
}) => {
    // const newFormatDate = new Date(dateString).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <View style={[styles.CardContainer, {}]}>
            <View style={{flexDirection: "row"}}>
                <View style={{flexDirection: "column", width: "60%",}}>
                    <Text style={[styles.TextTitle, {width: "100%",}]}>{title}</Text>
                    {/* <Text style={[styles.TextDescription, {}]}>{code}</Text> */}
                </View>
                <View style={{width: "40%", alignSelf: "flex-start", marginTop: 5, paddingRight: 5}}>
                    <Text style={[styles.TextStatus, {
                        backgroundColor: type=="Completed" ? COLORS.primaryGreenHex : status=="Processing" ? COLORS.primaryOrangeHex : COLORS.secondaryLightGreyHex,
                    }]}>
                        {type=="Approval" ? "Approved" : status}
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
        fontSize: 16,
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

export default JobListCard;
