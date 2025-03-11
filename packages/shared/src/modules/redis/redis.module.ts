import { Module } from '@nestjs/common';
import { MessageCacheService } from './message-cache-service.service';
import {RedisClientService } from '@tellme/common';
// import { ConfigModule } from '@nestjs/config'; 

@Module({
  // ConfigModule.forRoot({isGlobal : true}), 
  providers: [RedisClientService, MessageCacheService],
  exports: [RedisClientService, MessageCacheService]
})
export class RedisModule {}
