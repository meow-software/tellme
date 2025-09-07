import { IsSnowflake } from '../validators';

export class ResendConfirmationDto {
    @IsSnowflake()
    id: string;
}
