import { ConfigService } from '@nestjs/config';
export declare class PaystackService {
    private configService;
    private readonly logger;
    private readonly baseUrl;
    private readonly secretKey;
    constructor(configService: ConfigService);
    initializeTransaction(email: string, amount: number): Promise<any>;
    verifyTransaction(reference: string): Promise<any>;
}
