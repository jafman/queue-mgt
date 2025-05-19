import { Wallet } from './wallet.entity';
export declare enum TransactionType {
    CREDIT = "credit",
    DEBIT = "debit"
}
export declare class Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    description: string;
    reference: string;
    relatedTransactionId: string;
    relatedUserId: string;
    wallet: Wallet;
    createdAt: Date;
}
