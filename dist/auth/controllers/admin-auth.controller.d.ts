import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { AdminService } from '../../modules/users/admin/admin.service';
export declare class AdminAuthController {
    private authService;
    private adminService;
    constructor(authService: AuthService, adminService: AdminService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
}
