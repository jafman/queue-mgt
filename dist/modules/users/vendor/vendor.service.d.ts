import { Repository } from 'typeorm';
import { Vendor } from '../entities/vendor.entity';
import { CreateVendorDto } from '../dto/create-vendor.dto';
export declare class VendorService {
    private vendorRepository;
    constructor(vendorRepository: Repository<Vendor>);
    findByUsername(username: string): Promise<Vendor | null>;
    create(createVendorDto: CreateVendorDto): Promise<Vendor>;
}
