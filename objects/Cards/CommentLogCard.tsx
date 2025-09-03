import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CommentLogProps, WorkflowLogProps } from '../objects';
import { COLORS } from '../../themes/theme';

const CommentLogCard: React.FC<CommentLogProps> = ({
    pkkey,
    personName,
    comment,
    createdBy,
    lastUpdatedDate,
    lastUpdatedBy
}) => {

    return (
        <View style={[styles.CardContainer, {}]}>
            <View style={{flexDirection: "row", alignSelf: "flex-start",}}>
                {/* <View style={{flexDirection: "column", width: "30%"}}> */}
                <View style={{width: "30%"}}>
                    <Text style={[styles.TextTitle, {}]}>{personName}: </Text>
                    {/* <Text style={[styles.TextDescription, {}]}>{lastUpdatedDate}</Text> */}
                </View>
                <View style={{width: "40%", alignSelf: "flex-start",}}>
                    <Text style={[styles.TextDescription, {}]}>{comment}</Text>
                </View>
                <View style={{width: "30%", alignSelf: "flex-end",}}>
                    <Text style={[styles.TextTitle, {}]}>{lastUpdatedDate}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    CardContainer: {
        flexDirection: "column",
        width: "100%", 
        borderWidth: 0.4,
        padding: 10,
        marginVertical: 0,
    },
    TextTitle: {
        color: COLORS.primaryBlackHex,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: "left",
    },
    TextDescription: {
        color: COLORS.primaryBlackHex,
        fontSize: 13,
        textAlign: "left",
        // fontWeight: "bold",
    },
});

export default CommentLogCard;
