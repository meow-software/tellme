import { IsSnowflake } from '../../validators';

export class ResetPasswordDemandDto {
    @IsSnowflake()
    id: string;
}
