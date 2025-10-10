import { Injectable } from "@nestjs/common";
import { GoogleProvider } from "./google.provider";
import { OAuthUser } from "./oauth-provider.interface";
import { Provider } from "./../../../lib/core";

@Injectable()
export class SocialProvider  {
  constructor(
    private readonly googleProvider: GoogleProvider,
  ) {}

  async validateSocialToken(provider: Provider, token: string): Promise<OAuthUser> {
    switch (provider) {
      case 'google':
        return this.googleProvider.validateToken(token);
      default:
        throw new Error(`Unsupported social provider: ${provider}`);
    }
  }
}