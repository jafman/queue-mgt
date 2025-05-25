import { Wallet } from './wallet.entity';
export declare enum TransactionType {
    CREDIT = "credit",
    DEBIT = "debit"
}
export declare enum TransactionStatus {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed",
    ABANDONED = "abandoned",
    ONGOING = "ongoing",
    PROCESSING = "processing",
    QUEUED = "queued",
    REVERSED = "reversed"
}
export declare class Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    description: string;
    reference: string;
    relatedTransactionId: string;
    relatedUserId: string;
    wallet: Wallet;
    createdAt: Date;
}
