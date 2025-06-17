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
const nodemailer = require("nodemailer");
let MailerService = MailerService_1 = class MailerService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MailerService_1.name);
        this.email = this.configService.get('EMAIL_ADDRESS');
        this.password = this.configService.get('EMAIL_PASSWORD');
        if (!this.email || !this.password) {
            throw new Error('EMAIL_ADDRESS and EMAIL_PASSWORD must be defined in environment variables');
        }
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.email,
                pass: this.password,
            },
        });
    }
    async sendEmail({ to, toName, subject, html, text, from = this.email, fromName = 'Queue Mgt System', }) {
        try {
            const mailOptions = {
                from: `"${fromName}" <${from}>`,
                to: `"${toName}" <${to}>`,
                subject,
                text,
                html,
            };
            this.logger.debug(`Attempting to send email to ${to}`);
            const info = await this.transporter.sendMail(mailOptions);
            this.logger.debug(`Email sent successfully to ${to}`);
            return info;
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