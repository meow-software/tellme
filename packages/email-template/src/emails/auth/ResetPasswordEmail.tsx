import * as React from 'react';
import { APP_NAME } from '../../constant';
import { Button } from '../../components/ui/button';
import EmailWrapper from '../../components/layouts/email-wrapper';
import {
  I18n,
  SUPPORTED_LANGUAGES,
} from '../../lib/core';
import translations from '../../i18n/auth/ResetPasswordEmail.json';

export interface ResetPasswordEmailProps {
  email: string;
  code: string;
  resetUrl: string;
  lang: SUPPORTED_LANGUAGES;
}

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
  email,
  code,
  resetUrl,
  lang,
}) => {
  const i18n = new I18n(translations, lang);
  const link = `${resetUrl}?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`;

  return (
    <EmailWrapper>
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            {APP_NAME.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="m-0 text-lg leading-7 text-gray-900">
              {i18n.t('TITLE')}
            </h1>
            <p className="m-0 text-xs text-gray-500">
              {i18n.t('SUBTITLE')}
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
        </div>

        {/* Code box */}
        <div className="mt-5 text-center">
          <div className="inline-block px-6 py-3 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200">
            <p className="m-0 text-xl tracking-widest font-bold text-gray-900">
              {code}
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button href={link} children={i18n.t('RESET_BUTTON')} />
        </div>

        {/* Small note */}
        <div className="mt-4">
          <p className="m-0 text-gray-500 text-xs">
            {i18n.t('IGNORE_EMAIL')}
          </p>
        </div>
      </div>
    </EmailWrapper>
  );
};

export default ResetPasswordEmail;