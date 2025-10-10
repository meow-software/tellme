import { IsIn, IsString } from 'class-validator';
import { Provider, PROVIDERS } from "./../../../lib/core";

export class SocialProviderDto{
  @IsString()
  @IsIn(PROVIDERS)
  provider: Provider;

  @IsString()
  token: string;
}
