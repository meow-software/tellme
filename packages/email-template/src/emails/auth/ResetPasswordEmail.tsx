import * as React from 'react';
import { APP_NAME, CSS_MAIN_CONTAINER } from '@/constant';
import { Tailwind } from '@react-email/components';
import { Footer } from '@/components/layouts/footer';
import { Button } from '@/components/ui/button';
import EmailWrapper from '@/components/layouts/email-wrapper';

export interface ResetPasswordEmailProps {
    email: string;
    code: string;
    resetUrl: string;
    lang?: string;
}

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
    email,
    code,
    resetUrl,
    lang = 'en',
}) => {
    const link = `${resetUrl}?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`;

    return (
        <EmailWrapper>
            <div className='p-6'>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                        {APP_NAME.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="m-0 text-lg leading-7 text-gray-900">Forgot your password?</h1>
                        <p className="m-0 text-xs text-gray-500">
                            That's okay — it happens! Even I forget sometimes, just yesterday I forgot my password... wait, what was it again? Never mind. Click the button below to reset your password.
                        </p>
                    </div>
                </div>


                {/* Friendly intro */}
                <div className="mt-5">
                    <p className="m-0 text-gray-700">
                        Hi there — we received a request to reset the password for <strong>{email}</strong>. No worries: use the button below or copy the code provided.
                    </p>
                </div>


                {/* Code box */}
                <div className="mt-5 text-center">
                    <div className="inline-block px-6 py-3 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200">
                        <p className="m-0 text-xl tracking-widest font-bold text-gray-900">{code}</p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Button href={link} children="Reset Password" />
                </div>

                {/* Small note */}
                <div className="mt-4">
                    <p className="m-0 text-gray-500 text-xs">
                        If you did not request this password reset, you can safely ignore this email — your password will remain unchanged.
                    </p>
                </div>
            </div>
        </EmailWrapper>
    );
};

export default ResetPasswordEmail;