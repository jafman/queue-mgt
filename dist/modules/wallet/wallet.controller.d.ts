import { WalletService } from './wallet.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PaystackService } from './paystack.service';
import { InitializeWalletFundingDto } from './dto/initialize-wallet-funding.dto';
import { Transaction } from './entities/transaction.entity';
export declare class WalletController {
    private readonly walletService;
    private readonly paystackService;
    constructor(walletService: WalletService, paystackService: PaystackService);
    getBalance(req: any): Promise<{
        balance: number;
        email: string;
    }>;
    createTransaction(req: any, createTransactionDto: CreateTransactionDto): Promise<Transaction>;
    getTransactionHistory(req: any, page?: number, limit?: number): Promise<{
        transactions: Transaction[];
        total: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }>;
    initializeFunding(req: any, initializeFundingDto: InitializeWalletFundingDto): Promise<{
        access_code: any;
        reference: any;
        authorization_url: any;
    }>;
}
