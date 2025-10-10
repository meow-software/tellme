import { OAuthUserPayload } from "@tellme/common";

export class GetOrCreateOauthUserCommand {
  constructor(
    public readonly oauthUserPayload: OAuthUserPayload
  ) {}
}