import { Image, Text, View } from "react-native";
import { IconListPicture } from "../themes/CSS";

export const IPAddress = "https://192.168.0.90:7149";

export const TaskMenuItems = [
    { title: "Pending Task", key: "pending" },
    { title: "Approval Task", key: "approval" },
];

export const WorkflowMenuItems = [
    // { id: 1, title: "Material Request", navigate: "/workflow/materialsite", type: "material" },
    // { id: 2, title: "Production Trigger", navigate: "/workflow/productionsite", type: "production" },
    // { id: 3, title: "Purchase Request", navigate: "/workflow/purchasesite", type: "purchase" },
    // { id: 4, title: "Payment Request", navigate: "/workflow/paymentsite", type: "payment" },
    { id: 5, title: "Stock Movement", navigate: "/workflow/stocksite", type: "stock" },
];

export const CRMMenuItems = [
    { id: 1, title: "Product", navigate: "/crm/productcrm", type: "material" },
    { id: 2, title: "Customer", navigate: "/crm/personcrm", type: "customer" },
    { id: 3, title: "Supplier", navigate: "/crm/personcrm", type: "supplier" },
];

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
    description: string,
    productSeries: string,
    productStage: string,
    status: string,
    totalAmount: string,
    currencyName: string,
    remark: string,
    requester: string,
    dueDate: string,
    supplierName: string,
    movementType: string,
    debitAccount: string,
    shipping: string,
    getDate: string,
    createdDate: string,
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
    logDetail: string;
    lastUpdatedDate: string;
    lastUpdatedBy: string;
}

export interface AttachmentsProps {
    pkkey: string;
    fileName: string;
    attachmentLink: string;
    lastUpdatedDate: string;
    lastUpdatedBy: string;
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

export const formatDateTime = (dateString: string) => {
    // Create a Date object from the string
    const dateObj = new Date(dateString);

    // Get individual components
    const year = dateObj.getFullYear();  // 2024
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[dateObj.getMonth()];  // October
    const day = dateObj.getDate();  // 2

    // Get hours and minutes
    let hours = dateObj.getHours();  // 3
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');  // 45

    // AM/PM format
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;  // Convert to 12-hour format

    // Final formatted date string
    return `${day} ${month} ${year} ${hours}:${minutes}${ampm}`;
};

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