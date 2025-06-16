import { ConfigService } from '@nestjs/config';
export declare class MailerService {
    private configService;
    private readonly logger;
    private transporter;
    private readonly email;
    private readonly password;
    constructor(configService: ConfigService);
    sendEmail({ to, toName, subject, html, text, from, fromName, }: {
        to: string;
        toName: string;
        subject: string;
        html: string;
        text: string;
        from?: string;
        fromName?: string;
    }): Promise<any>;
}
