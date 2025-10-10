import { Provider } from "./../../../lib/core";

export interface OAuthUser {
  provider: Provider;
  providerId: string;
  email?: string;
  username?: string;
}

export interface OAuthUserPayload extends OAuthUser {
  email: string;
  username: string;
}

export interface OAuthProvider {
  validateToken(token: string): Promise<OAuthUser>;
}