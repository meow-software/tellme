import { Module } from '@nestjs/common';
import { MessageCacheService } from './message-cache-service.service';
import {RedisClientService } from '@tellme/common';
import { AuthCacheService } from './auth-cache-service.service';
// import { ConfigModule } from '@nestjs/config'; 

@Module({
  // ConfigModule.forRoot({isGlobal : true}), 
  providers: [RedisClientService, MessageCacheService, AuthCacheService],
  exports: [RedisClientService, MessageCacheService, AuthCacheService]
})
export class RedisModule {}
