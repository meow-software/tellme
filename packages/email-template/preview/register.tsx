import { ResetPasswordEmail, WelcomeEmail, PasswordChangedEmail } from "./../src";

export const EMAIL_COMPONENTS: {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}[] = [
    {
      id: "welcome",
      name: "Welcome Email",
      component: WelcomeEmail,
      props: {
        username: "Alice",
        email: "alice@example.com",
        confirmUrl: "https://example.com/confirm"
      }
    },
    {
      id: "reset-password",
      name: "Reset Password Email",
      component: ResetPasswordEmail,
      props: {
        resetUrl: "https://example.com/reset",
        email: "Bob@example.com",
        code: "123456"
      }
    },
    {
      id: "password-changed",
      name: "Password Changed Email",
      component: PasswordChangedEmail,
      props: {
        email: "Charlie@example.com",
        loginUrl: "https://example.com/login"
      }
    }
  ];
