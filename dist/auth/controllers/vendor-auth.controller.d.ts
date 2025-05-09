import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { VendorService } from '../../modules/users/vendor/vendor.service';
export declare class VendorAuthController {
    private authService;
    private vendorService;
    constructor(authService: AuthService, vendorService: VendorService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
}
