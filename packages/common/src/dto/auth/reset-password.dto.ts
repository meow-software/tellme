import { IsSnowflake } from '../index';

export class ResetPasswordDemandDto {
    @IsSnowflake()
    id: string;
}
