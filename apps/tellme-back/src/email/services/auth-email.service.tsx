import { Injectable } from '@nestjs/common';
import { Email } from '../email';
import { WelcomeEmail, WelcomeEmailProps, ResetPasswordEmail, ResetPasswordEmailProps } from 'src/lib/email-template';

@Injectable()
export class AuthEmailService {
  constructor(
  ) { }

  welcomeUser(data: WelcomeEmailProps) {
    return new Email(
      `Bienvenue sur TellMe, ${data.username}!`,
      <WelcomeEmail username={data.username} email={data.email} confirmUrl={data.confirmUrl} lang={data.lang} />,
    );
  }

  resetPassword(data: ResetPasswordEmailProps) {
    return new Email(
      'Réinitialisation du mot de passe',
      <ResetPasswordEmail email={data.email} code={data.code} resetUrl={data.resetUrl} lang={data.lang} />,
    );
  }
}