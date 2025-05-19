import { WalletService } from './wallet.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getBalance(req: any): Promise<{
        balance: number;
    }>;
    createTransaction(req: any, createTransactionDto: CreateTransactionDto): Promise<import("./entities/transaction.entity").Transaction>;
    getTransactionHistory(req: any, page?: number, limit?: number): Promise<{
        transactions: import("./entities/transaction.entity").Transaction[];
        total: number;
    }>;
}
