import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Recipient, EmailParams, MailerSend, Sender } from 'mailersend';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private mailerSend: MailerSend;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('MAILERSEND_API_KEY');
    console.log(apiKey);
    if (!apiKey) {
      throw new Error('MAILERSEND_API_KEY is not defined in environment variables');
    }
    this.mailerSend = new MailerSend({
      apiKey,
    });
  }

  async sendEmail({
    to,
    toName,
    subject,
    html,
    text,
    from = 'test-68zxl279yd54j905.mlsender.net',
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
      const recipients = [new Recipient(to, toName)];
      const sender = new Sender(from, fromName);
      
      const emailParams = new EmailParams()
        .setFrom(sender)
        .setTo(recipients)
        .setSubject(subject)
        .setHtml(html)
        .setText(text);

      this.logger.debug(`Attempting to send email to ${to}`);
      const response = await this.mailerSend.email.send(emailParams);
      this.logger.debug(`Email sent successfully to ${to}`);
      return response;
    } catch (error) {
    //   this.logger.error(`Failed to send email: ${error.message}`, error.stack);
    //   throw new Error(`Failed to send email: ${error.message}`);
    return true;
    }
  }
} 