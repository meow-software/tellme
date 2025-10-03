import EmailWrapper from '@/components/layouts/email-wrapper';
import { Button } from '@/components/ui/button';
import {
  I18n,
  SUPPORTED_LANGUAGES,
} from '@/lib/core';
import translations from '@/i18n/auth/WelcomeEmail.json';

export interface WelcomeEmailProps {
  email: string;
  username: string;
  confirmUrl: string;
  lang: SUPPORTED_LANGUAGES;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  email,
  username,
  confirmUrl,
  lang,
}) => {
  const i18n = new I18n(translations, lang);
  const greetingParts = i18n.t('GREETING').split('{username}');

  return (
    <EmailWrapper>
      <div className="bg-purple-500 text-white text-center p-6 rounded-t-lg">
        <h1 className="text-2xl font-bold">{i18n.t('TITLE')}</h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <p className="mb-4">
          <strong>
            {greetingParts[0]}
            {username}
            {greetingParts[1]}
          </strong>
          ,
        </p>
        <p className="mb-4">{i18n.t('THANKS')}</p>
        <p className="mb-6">{i18n.t('VERIFY')}</p>

        <div className="mb-6 text-center">
          <Button href={confirmUrl} children={i18n.t('VERIFY_BUTTON')} />
        </div>
      </div>
    </EmailWrapper>
  );
};

export default WelcomeEmail;