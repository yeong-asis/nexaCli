import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CommentLogProps, WorkflowLogProps } from '../objects';
import { BLUEUSEFULCOLOR, COLORS } from '../../themes/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CommentLogCard: React.FC<CommentLogProps> = ({
    pkkey,
    personName,
    comment,
    logOn,
    SMQID,
    process,
    status,
    parentCommentID,
    checkCommentEdit,
    onReplyPress,
    onEditPress,
    onDeletePress,
}) => {

    console.log(checkCommentEdit)

    return (
        <View style={[styles.CardContainer, {backgroundColor: parentCommentID=="0" ? COLORS.primaryWhiteHex : COLORS.primaryVeryLightGreyHex}]}>
            <View style={{flexDirection: parentCommentID == "0" ? "column" : "row", width: "100%" }}>
                {parentCommentID != "0" && (
                    <View style={{width: "10%", justifyContent: "flex-start"}}>
                        <Ionicons name="return-down-forward-outline" size={16} color={COLORS.primaryLightGreyHex} />
                    </View>
                )}
                <View style={{flexDirection: "column", width: parentCommentID=="0" ? "100%" : "90%" }}>
                    <View style={{justifyContent: "center",}}>
                        <View>
                            <Text style={[styles.TextTitle, {color: BLUEUSEFULCOLOR}]}>{personName}</Text>
                        </View>
                        <View>
                            <Text style={[styles.TextTitle, {}]}>{comment}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <View style={{flexDirection: "row", justifyContent: "flex-start"}}>
                            {parentCommentID == "0" && (
                            <TouchableOpacity onPress={onReplyPress}>
                                <Text style={styles.ReplyText}>Reply</Text>
                            </TouchableOpacity>
                            )}

                            {checkCommentEdit==true && (
                            <>
                            <TouchableOpacity onPress={onEditPress}>
                                <Text style={styles.ReplyText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onDeletePress}>
                                <Text style={styles.ReplyText}>Delete</Text>
                            </TouchableOpacity>
                            </>
                            )}
                        </View>
                        
                        <Text style={[styles.TextDescription, {textAlign: "right"}]}>{logOn}</Text>
                    </View>
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
        fontSize: 11,
        marginTop: 5,
    },
    ReplyText: {
        color: COLORS.primaryLightGreyHex,
        fontSize: 11,
        marginTop: 5,
        marginRight: 15
    },
});

export default CommentLogCard;
