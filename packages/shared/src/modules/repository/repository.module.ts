import { Module } from '@nestjs/common';
import { MessageRepository } from './message-repository.service';
import { PrismaService } from '@tellme/common';
import { UserRepository } from './user-repository.service';

@Module({
  providers: [ PrismaService, MessageRepository , UserRepository],
  exports: [ MessageRepository, UserRepository ]
})
export class RepositoryModule {}
