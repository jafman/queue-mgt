import { VendorService } from './vendor.service';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { Vendor } from '../entities/vendor.entity';
export declare class VendorController {
    private readonly vendorService;
    constructor(vendorService: VendorService);
    create(createVendorDto: CreateVendorDto): Promise<Omit<Vendor, 'password'>>;
    findAll(page?: number, limit?: number): Promise<{
        vendors: Omit<Vendor, "password">[];
        total: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }>;
}
