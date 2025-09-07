import { IsBoolean, IsOptional } from 'class-validator';

export class GetUserDto {
    @IsOptional()
    @IsBoolean()
    full: boolean = false;
}