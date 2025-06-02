export declare class MailService {
    private transporter;
    constructor();
    sendMail(options: {
        to: string;
        subject: string;
        html: string;
    }): Promise<any>;
}
