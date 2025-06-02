import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { AdminService } from '../../modules/users/admin/admin.service';
export declare class AdminAuthController {
    private authService;
    private adminService;
    constructor(authService: AuthService, adminService: AdminService);
    login(loginDto: LoginDto): Promise<{
        message: string;
        requiresPasswordReset: boolean;
        access_token?: undefined;
        user?: undefined;
    } | {
        access_token: string;
        user: any;
        message?: undefined;
        requiresPasswordReset?: undefined;
    }>;
}
