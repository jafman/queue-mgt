import { ConfigService } from '@nestjs/config';
export declare class MailerService {
    private configService;
    private readonly logger;
    private mailerSend;
    constructor(configService: ConfigService);
    sendEmail({ to, toName, subject, html, text, from, fromName, }: {
        to: string;
        toName: string;
        subject: string;
        html: string;
        text: string;
        from?: string;
        fromName?: string;
    }): Promise<import("mailersend/lib/services/request.service").APIResponse>;
}
