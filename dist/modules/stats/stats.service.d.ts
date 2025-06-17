import { Repository } from 'typeorm';
import { Vendor } from '../users/entities/vendor.entity';
import { Student } from '../users/entities/student.entity';
import { Transaction } from '../wallet/entities/transaction.entity';
export declare class StatsService {
    private vendorRepository;
    private studentRepository;
    private transactionRepository;
    constructor(vendorRepository: Repository<Vendor>, studentRepository: Repository<Student>, transactionRepository: Repository<Transaction>);
    getVendorStats(): Promise<{
        allVendors: number;
        activeVendors: number;
        inactiveVendors: number;
        pendingVendors: number;
    }>;
    getStudentStats(): Promise<{
        allStudents: number;
        activeStudents: number;
        inactiveStudents: number;
    }>;
    getTransactionStats(page?: number, limit?: number): Promise<{
        stats: {
            totalCreditAmount: number;
            totalDebitAmount: number;
            totalTransactionAmount: number;
        };
        transactions: Transaction[];
        total: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }>;
}
