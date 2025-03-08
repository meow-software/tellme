import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnowflakeGenerator } from '../interfaces';

@Injectable()
export class SnowflakeService extends SnowflakeGenerator{
    constructor(private readonly configService: ConfigService) {
        super(configService.get<number>('SNOWFLAKE_WORKER_ID', 0))
    }
}
