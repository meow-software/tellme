import { IsString, IsStrongPassword, Length } from 'class-validator';
import { IsSnowflake } from '../validators';

export class ResetPasswordConfirmationDto {
    @IsSnowflake()
    id: string;

    @IsString()
    @Length(6)
    code: string

    @IsStrongPassword()
    password: string;

    @IsStrongPassword()
    oldPassword: string;
}
