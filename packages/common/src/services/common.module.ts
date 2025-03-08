import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MailerService } from './mailer.service';
import { RedisClientService } from './redis.client.service';

@Module({
  providers: [PrismaService, MailerService, RedisClientService],
  exports: [PrismaService, MailerService, RedisClientService],
})
export class CommonModule {}
