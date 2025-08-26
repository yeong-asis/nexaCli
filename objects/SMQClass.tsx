// User.ts
export interface User {
    id: number;
    branchID: number;
    timeZoneID: number;
    userName: string;
    password: string;
    name: string;
    email: string;
    department?: number | null;
    role?: number | null;
    superior?: number | null;
    isActive: boolean;
    isEnable: boolean;
    isVerified: boolean;
    salt?: string | null;               // represent byte[] as base64 string
    encryptedPassword?: string | null;  // represent byte[] as base64 string
    createdBy?: string | null;
    createdOn?: Date | null;
    lastUpdatedBy?: string | null;
    lastUpdatedOn?: Date | null;
}

// SMQ.ts
export interface SMQ {
    id: number;
    branchID: number;
    smqCode: string;
    requester: number;
    category?: number | null;
    movementType?: number | null;
    receiveFrom?: string | null;   // Guid -> string
    deliverTo?: string | null;     // Guid -> string
    purpose: string;
    ptrid?: number | null;
    pmxid?: number | null;
    so?: number | null;
    rma?: number | null;
    receiverSignature?: string | null;   // byte[] -> base64 string
    delivererSignature?: string | null;  // byte[] -> base64 string
    remark?: string | null;
    validatorRemark?: string | null;
    approverRemark?: string | null;
    implementerRemark?: string | null;
    skipValidator: boolean;
    status: number;
    isValidateNotificationSent: boolean;
    validateNotificationSentDate?: Date | null;
    isApprovalNotificationSent: boolean;
    approvalNotificationSentDate?: Date | null;
    isAcceptNotificationSent: boolean;
    acceptNotificationSentDate?: Date | null;
    createdBy?: string | null;
    createdOn?: Date | null;
    lastUpdatedBy?: string | null;
    lastUpdatedOn?: Date | null;
}

// SMQ_Attachment.ts
export interface SMQ_Attachment {
    id: number;
    branchID: number;
    smqID: number;
    stage: string;
    fileName: string;
    fileSize?: number | null;
    attachment?: string | null;   // byte[] -> Base64 string
    uploadedBy?: string | null;
    createdBy?: string | null;
    createdOn?: Date | null;
    lastUpdatedBy?: string | null;
    lastUpdatedOn?: Date | null;
}

// SMQ_Product.ts
export interface SMQ_Product {
    id: number;
    branchID: number;
    smqID: number;
    productID?: string | null;      // Guid in C#
    productName: string;
    sku: string;
    stockOnHand?: number | null;
    quantity?: number | null;
    description?: string | null;
    notes?: string | null;
    location?: string | null;       // Guid in C#
    locationName?: string | null;
    unitPrice?: number | null;
    discount?: number | null;
    amount?: number | null;
    createdBy: string;
    createdOn: Date;
    lastUpdatedBy?: string | null;
    lastUpdatedOn?: Date | null;
}

export interface SMQ_UserColumn {
  id: number;
  branchID: number;
  userId: number;
  columnId: string;
}

export interface SMQ_CommentDetails {
  id: number;
  branchID: number;
  commentID: number;
  readReceipt: number;
  createdBy: string;
  createdOn: string | null; // Date stored as ISO string or null
}


export interface SMQ_Comment {
  id: number;
  branchID: number;
  smqID: number;
  parentCommentID: number;
  comment: string;
  status: number;
  createdBy: string;
  createdOn: string | null;       // Nullable<DateTime> -> string | null
  lastUpdatedBy: string;
  lastUpdatedOn: string | null;   // Nullable<DateTime> -> string | null
}

export interface SMQRequest {
    id: number;
    requesterID: number;
    validatorRemark?: string | null;
    approverRemark?: string | null;
    implementerRemark?: string | null;
    requesterList: User[];
    validatorIDList: User[];
    approverList: User[];
    implementerList: User[];
    productList: SMQ_Product[];
    uploadAttachmentList: SMQ_Attachment[];
    requesterAttachment?: SMQ_Attachment | null;
    workflowStatus: number;
    keyWord?: string | null;
    smqDetail?: SMQ | null;
    smqList: SMQ[];
    comment?: SMQ_Comment | null;
    commentDetails?: SMQ_CommentDetails | null;
    userColumn?: SMQ_UserColumn | null;
}
