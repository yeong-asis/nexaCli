import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CommentLogProps, WorkflowLogProps } from '../objects';
import { BLUEUSEFULCOLOR, COLORS } from '../../themes/theme';

const CommentLogCard: React.FC<CommentLogProps> = ({
    pkkey,
    personName,
    comment,
    logOn,
    status,
}) => {

    return (
        <View style={[styles.CardContainer, {}]}>
            <View style={{flexDirection: "column", width: "100%"}}>
                <View>
                    <Text style={[styles.TextTitle, {color: BLUEUSEFULCOLOR}]}>{personName}</Text>
                </View>
                <View>
                    <Text style={[styles.TextTitle, {}]}>{comment}</Text>
                </View>
                <View>
                    <Text style={[styles.TextDescription, {textAlign: "right"}]}>{logOn}</Text>
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
        paddingVertical: 12,
        marginVertical: 0,
    },
    TextTitle: {
        color: COLORS.primaryBlackHex,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: "left",
    },
    TextDescription: {
        color: COLORS.primaryLightGreyHex,
        fontSize: 10,
    },
});

export default CommentLogCard;
