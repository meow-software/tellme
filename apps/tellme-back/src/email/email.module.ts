import { Module } from '@nestjs/common';
import { AuthEmailService } from './services/auth-email.service';
import { MailerService } from './mailer.service';

@Module({
  providers: [
    MailerService,
    AuthEmailService
  ],
  exports: [
    MailerService,
    AuthEmailService
  ]
})
export class EmailModule { }
