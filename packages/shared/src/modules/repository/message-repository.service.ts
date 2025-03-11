import { Injectable } from '@nestjs/common';
import { BaseRepository, PrismaService } from '@tellme/common';
import { MessageEntity } from '@tellme/shared';

@Injectable()
export class MessageRepository extends BaseRepository<MessageEntity,  typeof PrismaService.prototype.message> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma.message);
  }
}
