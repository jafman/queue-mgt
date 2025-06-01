import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { StudentService } from '../users/student/student.service';
import { VendorService } from '../users/vendor/vendor.service';
import { AuthService } from '../../auth/services/auth.service';
import { Student } from '../users/entities/student.entity';
import { Vendor } from '../users/entities/vendor.entity';
export declare class WalletService {
    private walletRepository;
    private transactionRepository;
    private studentRepository;
    private vendorRepository;
    private studentService;
    private vendorService;
    private authService;
    constructor(walletRepository: Repository<Wallet>, transactionRepository: Repository<Transaction>, studentRepository: Repository<Student>, vendorRepository: Repository<Vendor>, studentService: StudentService, vendorService: VendorService, authService: AuthService);
    getOrCreateWallet(userId: string, userType: string): Promise<Wallet>;
    getWalletBalance(userId: string, userType: string): Promise<{
        balance: number;
        email: string;
    }>;
    createTransaction(userId: string, userType: string, createTransactionDto: CreateTransactionDto): Promise<Transaction>;
    getTransactionHistory(userId: string, userType: string, page?: number, limit?: number): Promise<{
        transactions: Transaction[];
        total: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }>;
    updateWalletBalance(wallet: Wallet): Promise<Wallet>;
}
