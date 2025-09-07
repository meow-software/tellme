import { IsOptional, IsString, MaxLength, IsUrl } from 'class-validator';
import { IsValidUsername } from '../validators';

export class UpdateUserDto {
  @IsOptional()
  @IsValidUsername()
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  bio?: string;

  @IsOptional()
  @IsUrl()
  avatar_url?: string;
}
