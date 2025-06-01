export declare enum RecipientType {
    STUDENT = "student",
    VENDOR = "vendor"
}
export declare class CreateTransferDto {
    amount: number;
    recipientUsername: string;
    recipientType: RecipientType;
}
