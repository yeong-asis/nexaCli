import { Image, Text, View } from "react-native";
import { IconListPicture } from "../themes/CSS";
import { COLORS } from "../themes/theme";

export const IPAddress = "http://192.168.168.150";

export const TaskMenuItems = [
    { title: "Pending Task", key: "pending" },
    { title: "Approval Task", key: "approval" },
];

export const WorkflowMenuItems = [
    // { id: 1, title: "Material Request", navigate: "MainMaterial", type: "material" },
    // { id: 2, title: "Production Trigger", navigate: "/workflow/productionsite", type: "production" },
    // { id: 3, title: "Purchase Request", navigate: "/workflow/purchasesite", type: "purchase" },
    // { id: 4, title: "Payment Request", navigate: "/workflow/paymentsite", type: "payment" },
    { id: 5, title: "Stock Movement", navigate: "MainStock", type: "stock" },
];

export const CRMMenuItems = [
    { id: 1, title: "Product", navigate: "/crm/productcrm", type: "material" },
    { id: 2, title: "Customer", navigate: "/crm/personcrm", type: "customer" },
    { id: 3, title: "Supplier", navigate: "/crm/personcrm", type: "supplier" },
];

export const statusContainerColors: { [key: string]: string } = {
    New: "#e8f5ff",
    Validated: "#D3EDF5",
    Approved: "#DAF5E6",
    Accepted: "#FFECCC",
    Completed: "#E0E7FF",
    Closed: COLORS.secondaryLightGreyHex,
    Rejected: "#FFDEDE",
};

export const statusTextColors: { [key: string]: string } = {
    New: "#0d99ff",
    Validated: "#58BAD7",
    Approved: "#3AC977",
    Accepted: "#FF9F00",
    Completed: "#3730A3",
    Closed: COLORS.primaryWhiteHex,
    Rejected: "#FF5E5E",
};

export const WorkflowStatusMap: Record<string, number> = {
    "Reject": 0,
    "New": 1,
    "Validated": 2,
    "Approved": 3,
    "Accepted": 4,
    "Completed": 5,
    "Closed": 9,
    "Cancelled": 10
};

export const WorkflowNextStatusMap: Record<string, string> = {
    "New": "Validate",
    "Validated": "Approve",
    "Approved": "Accepte",
    "Accepted": "Implement",
    "Completed": "Close",
};

export interface BookingProps {
    megaBookingCode: string;
    megaBookingName: string;
    customerCode: string;
    customerName: string;
    locationDescription: string;
    vehiclePlateNo: string;
    isAcknowlegdeGatepass: string;
    periodStart: string;
    periodEnd: string;
    ticket: string;
    productDescription: string;
    transporterName: string;
    weighingInDateTime: string;
    weighingOutDateTime: string;
}

export type User = {
    pkkey: string;
    fullName: string;
};

export type SelectionItem = {
    pkkey: string;
    name: string;
};

export interface TaskProps {
    pkkey: number,
    code: string,
    title: string,
    status: string,
    type: string,
}

export interface JobProps {
    pkkey: number,
    code: string,
    customerID: number,
    customerName: string,
    siteID: number,
    siteName: string,
    address: string,
    title: string,
    type: string,
    report: string,
    status: string,
    startDate: string,
    assignTo: string,
    priority: string,
    description: string,
}

export interface DailyTaskProps {
    pkkey: number,
    code: string,
    title: string,
    type: string,
    report: string,
}

export interface WorkflowProps {
    pkkey: number,
    code: string,
    status: string,
    statusID: string,
    remark: string,
    requesterID: string,
    RequesterName: string,
    receiveFromID: string,
    receiveFromName: string,
    deliverToID: string,
    deliverToName: string,
    MovementType: string,
    MoveTypeName: string,
    categoryID: string,
    categoryName: string,
    NEXTPIC: string,
    createdDate: string,
    SKIPValidator: string,
    isSelected?: boolean;
    onToggleSelect?: () => void;
}

export interface ProductProps {
    pkkey: number;
    Name: string;
    SKU: string;
    Category: string;
    Type: string;
    status: string;
}

export interface PersonProps {
    pkkey: number;
    Name: string;
    Description: string;
    Currency: string;
    PaymentTerm: string;
    Discount: string;
    status: string;
}

export interface TaskTestProps {
    id: number,
    SerialNumber: string,
    Title: string,
    Status: string,
    Requester: string,
    Category: string,
    Customer: string,
    Supplier: string,
    MRQ: string,
    Project: string,
    PO: string,
    POType: string,
    DueDate: string,
    Remark: string
}

export interface MessageProps {
    id: number;
    Title: string;
    Description: string;
    Date: string;
    status: string;
}

export interface AcknowledgeProps {
    megaBookingCode: string;
    vehiclePlateNo: string;
    driverIdentityNo: string;
    ticket: string;
    assignDateTime: string;
    weighingInDateTime: string;
    weighingOutDateTime: string;
    isConfirmGatepass: boolean;
    confirmGatepassUserCode: string;
    confirmGatepassDateTime: string;
}

export interface WorkflowLogProps {
    pkkey: string;
    SMQID: string;
    process: string;
    personName: string;
    comment: string;
    logOn: string;
}

export interface CommentLogProps {
    pkkey: string;
    SMQID: string;
    process: string;
    personName: string;
    comment: string;
    logOn: string;
    status: string;
    parentCommentID: string;
    checkCommentEdit: boolean;
    onReplyPress: any;
    onEditPress: any;
    onDeletePress: any;
}

export interface Validators {
    pkkey: string;
    name: string;
}

export interface WorkflowInfoProps {
    pkkey: string;
    code: string;
    Status: string;
    lastUpdatedDate: string;
    lastUpdatedBy: string;
}

export interface ScanTicketProps {
    refNo: string;
    telNo: string;
    vehicleNo: string;
}

export interface ItemProps {
    icon: React.ReactElement;
    title: string;
}

export interface DateTimePickerProps {
    onChange: (date: Date) => void;
    currentDate: Date;
}



export const GridItem = ({ icon, title }: ItemProps) => {
    return (
        <View style={IconListPicture.gridCSS}>
            <View>{icon}</View>
            <View style={{ marginTop: 10 }}>
                <Text style={IconListPicture.gridTitle}>{title}</Text>
            </View>
        </View>
    );
};