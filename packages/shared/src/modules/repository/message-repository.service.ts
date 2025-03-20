import { Injectable } from '@nestjs/common';
import { BaseRepository, PrismaService } from '@tellme/common';
import { MessageEntity } from '@tellme/shared';

@Injectable()
export class MessageRepository extends BaseRepository<MessageEntity,  typeof PrismaService.prototype.message> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma.message);
  }

  public edit(message: MessageEntity): Promise<MessageEntity> {
    return this.update(message.id, {
      content: message.content,
    });
  }
}
