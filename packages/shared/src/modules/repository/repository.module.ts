import { Module } from '@nestjs/common';
import { MessageRepository } from './message-repository.service';
import { PrismaService } from '@tellme/common';

@Module({
  providers: [ MessageRepository, PrismaService],
  exports: [ MessageRepository ]
})
export class RepositoryModule {}
