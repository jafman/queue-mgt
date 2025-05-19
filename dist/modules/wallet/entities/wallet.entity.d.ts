import { Transaction } from '../entities/transaction.entity';
export declare class Wallet {
    id: string;
    balance: number;
    userId: string;
    userType: string;
    transactions: Transaction[];
    createdAt: Date;
    updatedAt: Date;
}
