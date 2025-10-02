import { Injectable, Logger } from '@nestjs/common';
import { render } from '@react-email/render';
import { AbstractEmail, EmailPayload } from './email.abstract';
// import { transporter } from './email.config';

@Injectable()
export class MailerService  {
    private readonly logger = new Logger(MailerService .name);

    async send(emailTemplate: AbstractEmail, payload: EmailPayload): Promise<void> {
        console.log("mail envoyer")
        /*
        try {
            const html = await render(emailTemplate.render(payload.variables));
            const text =
                emailTemplate.renderText?.(payload.variables) ||
                (await render(emailTemplate.render(payload.variables), { plainText: true }));

            await transporter.sendMail({
                from: '"TellMe" <no-reply@tellme.com>',
                to: payload.to,
                subject: payload.subject || emailTemplate.subject,
                html,
                text,
            });

            this.logger.log(`✅ Email envoyé à ${payload.to}`);
        } catch (error) {
            this.logger.error(`❌ Erreur lors de l'envoi du mail à ${payload.to}`, error);
            throw error;
        }
            */
    }
}
