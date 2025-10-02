import * as React from 'react';

export interface ResetPasswordEmailProps {
    email: string
    code: string;
}

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
    email,
    code,
}) => (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <h2>Bonjour </h2>
        <p>Voici le code {code} pour réinitialiser votre mot de passe</p>
    </div>
);
export default ResetPasswordEmail;