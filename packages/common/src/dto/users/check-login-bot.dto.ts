import { IsString, IsNotEmpty } from 'class-validator';
import { IsSnowflake } from '../validators';

export class CheckLoginBotDto {
  @IsSnowflake()
  id: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}