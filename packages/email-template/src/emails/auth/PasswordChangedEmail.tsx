import * as React from 'react';
import { APP_NAME } from '@/constant';
import EmailWrapper from '@/components/layouts/email-wrapper';
import { Button } from '@/components/ui/button';

export interface PasswordChangedEmailProps {
  email: string;
  loginUrl: string; 
  lang?: string;
}

export const PasswordChangedEmail: React.FC<PasswordChangedEmailProps> = ({
  email,
  loginUrl,
  lang = 'en',
}) => {
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
              Your password was changed successfully!
            </h1>
            <p className="m-0 text-xs text-gray-500">
              We wanted to let you know that your {APP_NAME} password has been
              updated.
            </p>
          </div>
        </div>

        {/* Friendly intro */}
        <div className="mt-5">
          <p className="m-0 text-gray-700">
            Hi there — we’re confirming that the password for{' '}
            <strong>{email}</strong> has been changed successfully.
          </p>
          <p className="mt-3 text-gray-700">
            If you made this change, there’s nothing else you need to do.
          </p>
          <p className="mt-2 text-gray-700">
            If you <strong>did not</strong> change your password, please reset it
            immediately or contact our support team to secure your account.
          </p>
        </div>

        {/* CTA button */}
        <div className="mt-6 text-center">
          <Button href={loginUrl}>Go to Login</Button>
        </div>

        {/* Security tips */}
        <div className="mt-4 text-xs text-gray-500">
          <p className="m-0">
            Tip: For your security, avoid reusing passwords and make sure your new password is strong and unique.
          </p>
        </div>
      </div>
    </EmailWrapper>
  );
};

export default PasswordChangedEmail;
