import { Repository } from 'typeorm';
import { Vendor } from '../entities/vendor.entity';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { MailerService } from '../../../mailer/mailer.service';
export declare class VendorService {
    private vendorRepository;
    private mailerService;
    constructor(vendorRepository: Repository<Vendor>, mailerService: MailerService);
    private generatePassword;
    findByUsername(username: string): Promise<Vendor | null>;
    findByUsernameOrEmail(identifier: string): Promise<Vendor | null>;
    create(createVendorDto: CreateVendorDto): Promise<Vendor>;
    updatePassword(id: string, hashedPassword: string): Promise<void>;
    updateFirstTimeLogin(id: string, value: boolean): Promise<void>;
}
