import { Injectable } from '@nestjs/common';
import { ResetPasswordEmailProps, WelcomeEmailProps } from '@tellme/email-template';
import { MailerService } from 'src/email/mailer.service';
import { AuthEmailService } from 'src/email/services/auth-email.service';

@Injectable()
export class NotificationService {
  constructor(private readonly mailer: MailerService, private readonly authEmail: AuthEmailService) {}

  async sendConfirmEmail(data: WelcomeEmailProps) {
    await this.mailer.send(this.authEmail.welcomeUser(data), {
      to: data.email,
      subject: 'Confirm Email',
    });
  }

  async sendResetPassword(data: ResetPasswordEmailProps) {
    await this.mailer.send(this.authEmail.resetPassword(data), {
      to: data.email,
      subject: 'Reset Password',
    });
  }
}
