import { Injectable, Logger } from '@nestjs/common';
import { render } from '@react-email/render';
import { AbstractEmail, EmailPayload } from './email.abstract';
import { createTransport } from 'nodemailer';
import { Resend } from 'resend';
import { envIsProd, requireEnv } from '@tellme/common';

@Injectable()
export class MailerService {
    private readonly logger = new Logger(MailerService.name);
    protected transporter = createTransport({
        host: process.env.MAILER_HOST,
        port: Number(process.env.MAILER_PORT || 587),
        secure: false,
        ignoreTLS: true,
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASS,
        },
    });

    protected resend : Resend = new Resend(process.env.RESEND_API_KEY);

    protected from  = `"TellMe" <${process.env.RESEND_FROM}>`; // <no-reply@tellme.com>

    protected async byTransporter(emailTemplate: AbstractEmail, payload: EmailPayload) {
        const html = await render(emailTemplate.render(payload.variables));
        const text =
            emailTemplate.renderText?.(payload.variables) ||
            (await render(emailTemplate.render(payload.variables), { plainText: true }));

        await this.transporter.sendMail({
            from: this.from,
            to: payload.to,
            subject: payload.subject || emailTemplate.subject,
            html,
            text,
        });
    }

    protected async byResend(emailTemplate: AbstractEmail, payload: EmailPayload) {
        const to = envIsProd(requireEnv("NODE_ENV")) ? payload.to : `delivered${payload.to.split('@')[0]}+@resend.dev`;
        console.log("--envoyer", to,"--par", this.from)
        await this.resend.emails.send({
            from: this.from,
            to: to,
            subject: payload.subject || emailTemplate.subject,
            // html: '<strong>It works!</strong>', 
            react: emailTemplate.render(payload.variables)
        });
    }

    async send(emailTemplate: AbstractEmail, payload: EmailPayload): Promise<void> {
        try {
            await this.byResend(emailTemplate, payload);
            this.logger.log(`✅ Email envoyé à ${payload.to}`);
        } catch (error) {
            this.logger.error(`❌ Erreur lors de l'envoi du mail à ${payload.to}`, error);
            throw error;
        }
    }
}
