import { WalletService } from './wallet.service';
import { PaystackService } from './paystack.service';
import { InitializeWalletFundingDto } from './dto/initialize-wallet-funding.dto';
import { Transaction } from './entities/transaction.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
export declare class WalletController {
    private readonly walletService;
    private readonly paystackService;
    constructor(walletService: WalletService, paystackService: PaystackService);
    getBalance(req: any): Promise<{
        balance: number;
        email: string;
    }>;
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
    transfer(req: any, createTransferDto: CreateTransferDto): Promise<Transaction>;
    validateUsername(username: string): Promise<{
        fullName: string;
        userType: "student" | "vendor" | null;
        exists: boolean;
    }>;
    withdraw(req: any, createWithdrawalDto: CreateWithdrawalDto): Promise<Transaction>;
}
