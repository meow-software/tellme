import { IsBoolean, IsEmail, IsOptional, IsStrongPassword, ValidateNested } from 'class-validator';
import { IsValidUsername } from '../validators';
import { RegisterDto } from '../auth';

export class CreateUserDto extends RegisterDto {
  // @IsValidUsername()
  // username: string;

  // @IsEmail()
  // email: string;

  // @IsStrongPassword()
  // password: string;
}