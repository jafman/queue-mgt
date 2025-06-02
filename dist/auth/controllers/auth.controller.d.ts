import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AuthService } from '../services/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    resetPassword(userType: string, resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
