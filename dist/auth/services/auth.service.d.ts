import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { VendorService } from '../../modules/users/vendor/vendor.service';
import { StudentService } from '../../modules/users/student/student.service';
export declare class AuthService {
    private jwtService;
    private studentService;
    private vendorService;
    constructor(jwtService: JwtService, studentService: StudentService, vendorService: VendorService);
    validateUser(username: string, password: string, user: any): Promise<any>;
    login(user: any, userType: string): Promise<{
        access_token: string;
        user: any;
    }>;
    resetPassword(userType: string, resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
