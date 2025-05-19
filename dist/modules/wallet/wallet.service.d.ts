import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class WalletService {
    private walletRepository;
    private transactionRepository;
    constructor(walletRepository: Repository<Wallet>, transactionRepository: Repository<Transaction>);
    getOrCreateWallet(userId: string, userType: string): Promise<Wallet>;
    getWalletBalance(userId: string, userType: string): Promise<number>;
    createTransaction(userId: string, userType: string, createTransactionDto: CreateTransactionDto): Promise<Transaction>;
    getTransactionHistory(userId: string, userType: string, page?: number, limit?: number): Promise<{
        transactions: Transaction[];
        total: number;
    }>;
}
