"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mailersend_1 = require("mailersend");
let MailerService = MailerService_1 = class MailerService {
    configService;
    logger = new common_1.Logger(MailerService_1.name);
    mailerSend;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('MAILERSEND_API_KEY');
        console.log(apiKey);
        if (!apiKey) {
            throw new Error('MAILERSEND_API_KEY is not defined in environment variables');
        }
        this.mailerSend = new mailersend_1.MailerSend({
            apiKey,
        });
    }
    async sendEmail({ to, toName, subject, html, text, from = 'test-68zxl279yd54j905.mlsender.net', fromName = 'Queue Mgt System', }) {
        try {
            const recipients = [new mailersend_1.Recipient(to, toName)];
            const sender = new mailersend_1.Sender(from, fromName);
            const emailParams = new mailersend_1.EmailParams()
                .setFrom(sender)
                .setTo(recipients)
                .setSubject(subject)
                .setHtml(html)
                .setText(text);
            this.logger.debug(`Attempting to send email to ${to}`);
            const response = await this.mailerSend.email.send(emailParams);
            this.logger.debug(`Email sent successfully to ${to}`);
            return response;
        }
        catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`, error.stack);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = MailerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailerService);
//# sourceMappingURL=mailer.service.js.map