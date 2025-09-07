import { IsString, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CheckLoginDto {
  @IsString()
  @IsNotEmpty()
  usernameOrEmail: string;

  @IsStrongPassword()
  password: string;
}