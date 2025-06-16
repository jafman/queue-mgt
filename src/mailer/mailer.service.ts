import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;
  private readonly email!: string;
  private readonly password!: string;

  constructor(private configService: ConfigService) {
    this.email = this.configService.get<string>('EMAIL_ADDRESS')!;
    this.password = this.configService.get<string>('EMAIL_PASSWORD')!;

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

  async sendEmail({
    to,
    toName,
    subject,
    html,
    text,
    from = this.email,
    fromName = 'Queue Mgt System',
  }: {
    to: string;
    toName: string;
    subject: string;
    html: string;
    text: string;
    from?: string;
    fromName?: string;
  }) {
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
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
} 