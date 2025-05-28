import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { PaystackService } from '../paystack.service';
import { WalletService } from '../wallet.service';
import { Wallet } from '../entities/wallet.entity';
export declare class VerifyTransactionJob {
    private transactionRepository;
    private paystackService;
    private walletService;
    private walletRepository;
    private readonly logger;
    private readonly MAX_ATTEMPTS;
    private readonly POLL_INTERVAL;
    constructor(transactionRepository: Repository<Transaction>, paystackService: PaystackService, walletService: WalletService, walletRepository: Repository<Wallet>);
    handleVerification(): Promise<void>;
}
