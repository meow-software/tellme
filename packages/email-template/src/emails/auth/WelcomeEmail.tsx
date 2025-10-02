import { Tailwind } from '@react-email/components';

export interface WelcomeEmailProps {
  email: string;
  username: string;
  confirmUrl: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ email, username, confirmUrl }) => {
  return (
    <Tailwind>
      <div className="bg-gray-50 font-sans text-gray-800 p-6">
        {/* Header */}
        <div className="bg-purple-500 text-white text-center p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold">Welcome to Tell Me!</h1>
        </div>

        {/* Body */}
        <div className="bg-white p-6 rounded-b-lg shadow-md">
          <p className="mb-4">Hey <strong>{username}</strong>,</p>
          <p className="mb-4">
            Thanks for registering an account with Tell Me!
          </p>
          <p className="mb-6">
            Before we get started, we'll need to verify your email.
          </p>

          <div className="text-center mb-6">
            <a
              href={confirmUrl}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg inline-block font-semibold"
            >
              Verify Email
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-4">
          <p>Sent by Tell Me • <a href="https://Tell Me.com/blog" className="underline">check our blog</a> • <a href="https://twitter.com/TellMeapp" className="underline">@TellMeapp</a></p>
          <p>Marseille, France</p>
        </div>
      </div>
    </Tailwind>
  );
};

export default WelcomeEmail;