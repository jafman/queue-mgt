import { Repository } from 'typeorm';
import { Vendor } from '../users/entities/vendor.entity';
export declare class StatsService {
    private vendorRepository;
    constructor(vendorRepository: Repository<Vendor>);
    getVendorStats(): Promise<{
        allVendors: number;
        activeVendors: number;
        inactiveVendors: number;
        pendingVendors: number;
    }>;
}
