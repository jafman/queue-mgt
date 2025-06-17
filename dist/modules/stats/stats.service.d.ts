import { Repository } from 'typeorm';
import { Vendor } from '../users/entities/vendor.entity';
import { Student } from '../users/entities/student.entity';
export declare class StatsService {
    private vendorRepository;
    private studentRepository;
    constructor(vendorRepository: Repository<Vendor>, studentRepository: Repository<Student>);
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
