import * as React from 'react';

export interface WelcomeEmailProps {
  email: string;
  username: string;
  confirmUrl: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ email, username, confirmUrl }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
    <h1>Bienvenue, {username} 👋</h1>
    <p>Merci de t’être inscrit sur TellMe !</p>
    <p>Nous sommes ravis de t’avoir parmi nous 🚀</p>
  </div>
);