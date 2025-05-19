import { TransactionType } from '../entities/transaction.entity';
export declare class CreateTransactionDto {
    amount: number;
    type: TransactionType;
    description?: string;
    reference?: string;
    recipientId?: string;
    recipientType?: string;
}
