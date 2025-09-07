import { Injectable } from '@nestjs/common';
import { SnowflakeGenerator } from '../interfaces/';

@Injectable()
export class SnowflakeService extends SnowflakeGenerator {
    constructor() {
        super(Number(process.env.SNOWFLAKE_WORKER_ID ?? -1));
    }
}