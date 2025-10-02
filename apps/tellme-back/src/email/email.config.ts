import { createTransport } from 'nodemailer';

export const transporter = createTransport({
  host: process.env.MAILER_HOST,
  port: Number(process.env.MAILER_PORT || 587),
  secure: false, 
  ignoreTLS: true,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});