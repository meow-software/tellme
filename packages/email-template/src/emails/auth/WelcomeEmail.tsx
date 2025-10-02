import EmailWrapper from '@/components/layouts/email-wrapper';
import { Button } from '@/components/ui/button';

export interface WelcomeEmailProps {
  email: string;
  username: string;
  confirmUrl: string;
  lang?: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ email, username, confirmUrl, lang='en' }) => {
  return (
    <EmailWrapper>
      <div className="bg-purple-500 text-white text-center p-6 rounded-t-lg">
        <h1 className="text-2xl font-bold">Welcome to Tell Me! </h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <p className="mb-4"><strong>Hey {username}</strong>,</p>
        <p className="mb-4">
          Thanks for registering an account with Tell Me!
        </p>
        <p className="mb-6">
          Before we get started, we'll need to verify your email.
        </p>

        <div className="mb-6 text-center">
          <Button href={confirmUrl} children="Verify Email" />
        </div>
      </div>

    </EmailWrapper>
  );
};

export default WelcomeEmail;