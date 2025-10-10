import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../update-user.command';
import { BadRequestException, Inject } from '@nestjs/common';
import { UserRepository } from 'src/lib/database';
import { buildRedisCacheKeyUser, EVENT_BUS, type IRedisService, REDIS_SERVICE, type IEventBus, EB, AuthCodes } from 'src/lib/common';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private userRepository: UserRepository,
    @Inject(EVENT_BUS) protected readonly eventBus: IEventBus,
    @Inject(REDIS_SERVICE) private readonly redisService: IRedisService,
  ) { }

  async execute(command: UpdateUserCommand) {
    const { id } = command;
    let { dto } = command;

    if (Object.keys(dto).length === 0) {
      throw new BadRequestException({ code: AuthCodes.NO_FIELDS_TO_UPDATE, message: 'No fields to update.' });
    }
    delete dto['password'];

    const user = await this.userRepository.update(id, dto);
    // invalidate cache
    await this.redisService.del(buildRedisCacheKeyUser(id));
    // publish event
    await this.eventBus.publish(EB.CHANNEL.USER, {
      type: EB.USER.UPDATED,
      data: {
        id: user.id,
        username: user.username,
        updated: {
          ...dto
        },
      }
    });
    return user;
  }
}
