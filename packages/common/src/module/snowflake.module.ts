import { Module } from "@nestjs/common";
import { SnowflakeService } from "../services";

@Module({
  providers: [
    SnowflakeService
  ],
  exports: [SnowflakeService],
})
export class SnowflakeModule {}
