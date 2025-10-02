import { ResetPasswordEmail, WelcomeEmail } from "../src";

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
      id: "reset",
      name: "Reset Password Email",
      component: ResetPasswordEmail,
      props: {
        resetUrl: "https://example.com/reset",
        username: "Bob"
      }
    }
  ];
