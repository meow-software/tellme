import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { handlePrismaError, UserRepository } from 'src/lib/database';
import { EB, EVENT_BUS, type IEventBus, SnowflakeService, } from 'src/lib/common';
import { GetOrCreateOauthUserCommand } from '../get-or-create-oauth-user.command';

@CommandHandler(GetOrCreateOauthUserCommand)
export class GetOrCreateOauthUserHandler implements ICommandHandler<GetOrCreateOauthUserCommand> {
  constructor(
    private userRepository: UserRepository,
    private snowflake: SnowflakeService,
    @Inject(EVENT_BUS) protected readonly eventBus: IEventBus,
  ) { }

  async execute(command: GetOrCreateOauthUserCommand) {
    let user;
    try {
      user = await this.userRepository.getOrCreateOAuthUser({
        id: this.snowflake.generate(),
        provId: this.snowflake.generate(),
        ...command.oauthUserPayload
      });
    } catch (e) {
      handlePrismaError(e);
    }
    return user;
  }
}