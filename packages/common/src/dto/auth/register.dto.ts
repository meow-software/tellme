import { IsEmail, IsStrongPassword } from 'class-validator';
import { IsValidUsername } from '../validators';

export class RegisterDto{
  @IsValidUsername()
  username: string;

  @IsEmail() 
  email: string;

  @IsStrongPassword()
  password: string;
}
