// ActionButtons.js (or inside the same file if small)
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

export default function ActionButtons({
    requester,
    currentUserID,
    status,
    isValidators,
    category,
    movementType,
    receiveFrom,
    deliverTo,
    purpose,
    remark,
    products,
    attachments,
    EditSMQ,
    processNextStep,
    WorkflowNextStatusMap,
    setModalAction,
    setShowSummary,
    styles,
    colors,
    headerBgColor,
}: any) {
    return (
        <View style={{ flexDirection: "column", justifyContent: "space-around", marginTop: 10 }}>
            {/* EDIT */}
            {(requester == currentUserID && (status == "New" || status == "Validated" || status == "Rejected")) && (
                <TouchableOpacity
                style={[styles.Button, { backgroundColor: colors.primaryLightGreyHex }]}
                onPress={() =>
                    EditSMQ(requester, category, movementType, receiveFrom, deliverTo, purpose, remark, products, attachments)
                }
                >
                    <Text style={styles.ButtonText}>Edit</Text>
                </TouchableOpacity>
            )}

            {/* APPROVE / REJECT */}
            {isValidators === true && (
                <>
                <TouchableOpacity
                    style={[styles.Button, { backgroundColor: headerBgColor }]}
                    onPress={() => {
                    setModalAction("approve");
                    setShowSummary(true);
                    }}
                >
                    <Text style={styles.ButtonText}>{WorkflowNextStatusMap[status]}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.Button, { backgroundColor: colors.primaryRedHex }]}
                    onPress={() => {
                    setModalAction("reject");
                    setShowSummary(true);
                    }}
                >
                    <Text style={styles.ButtonText}>Reject</Text>
                </TouchableOpacity>
                </>
            )}

            {/* CLOSE */}
            {requester == currentUserID && status == "Completed" && (
                <TouchableOpacity
                style={[styles.Button, { backgroundColor: headerBgColor }]}
                onPress={() =>
                    processNextStep(
                        requester,
                        category,
                        movementType,
                        receiveFrom,
                        deliverTo,
                        purpose,
                        remark,
                        products,
                        attachments,
                        "close"
                    )}
                >
                    <Text style={styles.ButtonText}>Close</Text>
                </TouchableOpacity>
            )}

            {/* REVISE / CANCEL */}
            {requester == currentUserID && status == "Rejected" && (
                <>
                <TouchableOpacity
                    style={[styles.Button, { backgroundColor: headerBgColor }]}
                    onPress={() =>
                    processNextStep(
                        requester,
                        category,
                        movementType,
                        receiveFrom,
                        deliverTo,
                        purpose,
                        remark,
                        products,
                        attachments,
                        "revise"
                    )}
                >
                    <Text style={styles.ButtonText}>Revise</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.Button, { backgroundColor: colors.primaryRedHex }]}
                    onPress={() =>
                    processNextStep(
                        requester,
                        category,
                        movementType,
                        receiveFrom,
                        deliverTo,
                        purpose,
                        remark,
                        products,
                        attachments,
                        "cancel"
                    )}
                >
                    <Text style={styles.ButtonText}>Cancel</Text>
                </TouchableOpacity>
                </>
            )}
        </View>
    );
}
