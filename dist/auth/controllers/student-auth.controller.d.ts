import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { StudentService } from '../../modules/users/student/student.service';
export declare class StudentAuthController {
    private authService;
    private studentService;
    constructor(authService: AuthService, studentService: StudentService);
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
