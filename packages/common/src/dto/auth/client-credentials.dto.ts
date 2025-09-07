import { IsString, Length } from 'class-validator';
import { IsSnowflake } from '../validators';

export class ClientCredentialsDto {
  @IsSnowflake()
  id: string;

  @IsString()
  @Length(70)
  clientSecret: string;
}
