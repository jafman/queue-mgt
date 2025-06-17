import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
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
        transactions: import("../wallet/entities/transaction.entity").Transaction[];
        total: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }>;
    getOverview(): Promise<{
        totalTransactionsAmount: number;
        totalVendors: number;
        totalStudents: number;
        recentActivities: import("../wallet/entities/transaction.entity").Transaction[];
    }>;
}
