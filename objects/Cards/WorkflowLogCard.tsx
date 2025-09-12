import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WorkflowLogProps } from '../objects';
import { COLORS } from '../../themes/theme';

const WorkflowLogCard: React.FC<WorkflowLogProps> = ({
    pkkey,
    SMQID,
    process,
    personName,
    comment,
    logOn,
}) => {

    return (
        <View style={[styles.CardContainer, {}]}>
            <View style={{flexDirection: "column", width: "100%"}}>
                <View>
                    <Text style={[styles.TextTitle, {}]}>{comment}</Text>
                </View>
                <View>
                    <Text style={[styles.TextDescription, {}]}>{logOn}</Text>
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
        fontSize: 10,
        textAlign: "left",
        // fontWeight: "bold",
    },
});

export default WorkflowLogCard;
