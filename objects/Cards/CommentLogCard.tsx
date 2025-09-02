import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CommentLogProps, WorkflowLogProps } from '../objects';
import { COLORS } from '../../themes/theme';

const CommentLogCard: React.FC<CommentLogProps> = ({
    pkkey,
    comment,
    createdBy,
    lastUpdatedDate,
    lastUpdatedBy
}) => {

    return (
        <View style={[styles.CardContainer, {}]}>
            <View style={{flexDirection: "row"}}>
                <View style={{flexDirection: "column", width: "35%"}}>
                    <Text style={[styles.TextTitle, {}]}>User ID: {createdBy}</Text>
                    {/* <Text style={[styles.TextDescription, {}]}>{lastUpdatedDate}</Text> */}
                </View>
                <View style={{width: "65%", alignSelf: "flex-start",}}>
                    <Text style={[styles.TextTitle, {}]}>{comment}</Text>
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
        padding: 15,
        marginVertical: 0,
    },
    TextTitle: {
        color: COLORS.primaryBlackHex,
        fontSize: 13,
        fontWeight: 'bold',
        marginVertical: 5,
        textAlign: "left",
        textAlignVertical: "center",
    },
    TextDescription: {
        color: COLORS.primaryBlackHex,
        fontSize: 14,
        marginVertical: 1,
        textAlign: "left",
        textAlignVertical: "center",
        // fontWeight: "bold",
    },
});

export default CommentLogCard;
