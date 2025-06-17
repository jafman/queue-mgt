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
}
