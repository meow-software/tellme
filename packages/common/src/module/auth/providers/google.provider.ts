import { OAuthProvider, OAuthUser } from './oauth-provider.interface';
import { OAuth2Client } from 'google-auth-library';
import { requireEnv } from '../../../utils';

export class GoogleProvider implements OAuthProvider {
  private client = new OAuth2Client(requireEnv('GOOGLE_CLIENT_ID'));

  async validateToken(token: string): Promise<OAuthUser> {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error('Invalid Google token');

    return {
      provider: 'google',
      providerId: payload.sub,
      email: payload.email,
      username: payload.name,
    };
  }
}