import * as React from 'react';
import { APP_NAME } from './../../constant';
import EmailWrapper from './../../components/layouts/email-wrapper';
import { Button } from './../../components/ui/button';
import {
  I18n,
  SUPPORTED_LANGUAGES,
} from './../../lib/core';
import translations from './../../i18n/auth/PasswordChangedEmail.json';

export interface PasswordChangedEmailProps {
  email: string;
  loginUrl: string;
  lang: SUPPORTED_LANGUAGES;
}

export const PasswordChangedEmail: React.FC<PasswordChangedEmailProps> = ({
  email,
  loginUrl,
  lang,
}) => {
  const i18n = new I18n(translations, lang);

  return (
    <EmailWrapper>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold">
            {APP_NAME.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="m-0 text-lg leading-7 text-gray-900">
              {i18n.t('TITLE')}
            </h1>
            <p className="m-0 text-xs text-gray-500">
              {i18n.t('SUBTITLE', { appName: APP_NAME })}
            </p>
          </div>
        </div>

        {/* Friendly intro */}
        <div className="mt-5">
          <p className="m-0 text-gray-700">
            {i18n.t('GREETING', {
              email: {
                value: email, render: (v) => {
                  return <strong>{v}</strong>
                }
              },
            })}
          </p>
          <p className="mt-3 text-gray-700">
            {i18n.t('NO_ACTION_NEEDED')}
          </p>
          <p className="mt-2 text-gray-700">
            {i18n.t('SECURE_ACCOUNT')}
          </p>
        </div>

        {/* CTA button */}
        <div className="mt-6 text-center">
          <Button href={loginUrl}>{i18n.t('LOGIN_BUTTON')}</Button>
        </div>

        {/* Security tips */}
        <div className="mt-4 text-xs text-gray-500">
          <p className="m-0">
            {i18n.t('SECURITY_TIP')}
          </p>
        </div>
      </div>
    </EmailWrapper>
  );
};

export default PasswordChangedEmail;
