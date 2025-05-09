import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
export declare class AdminService {
    private adminRepository;
    constructor(adminRepository: Repository<Admin>);
    findByUsername(username: string): Promise<Admin | null>;
    findByUsernameOrEmail(identifier: string): Promise<Admin | null>;
}
