import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../update-user.command';
import { Inject } from '@nestjs/common';
import type { IEventBus } from 'src/lib';
import {SnowflakeService, DatabaseService, EVENT_BUS} from 'src/lib';
import { AtlasRedisService } from 'src/services/redis.service';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  private CACHE_TTL = 300;
  constructor(
    private db: DatabaseService,
    private snowflake: SnowflakeService,
    private redis: AtlasRedisService,
    @Inject(EVENT_BUS) private eventBus: IEventBus,
  ) {}

  async execute(command: UpdateUserCommand) {
    const { userId, dto } = command;
    const user = await this.db.user.update({ where: { id: this.snowflake.toBigInt(userId) }, data: dto });
    // invalidate cache
    await this.redis.del(`user:${userId}`);
    // publish event
    await this.eventBus.publish('user.updated', {
      id: user.id,
      username: user.username,
      // avatar_url: user.avatar_url,
      fields: Object.keys(dto),
    });
    return user;
  }
}
