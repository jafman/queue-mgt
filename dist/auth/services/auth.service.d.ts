import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    validateUser(username: string, password: string, user: any): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
