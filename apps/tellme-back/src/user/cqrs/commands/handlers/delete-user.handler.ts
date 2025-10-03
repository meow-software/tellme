
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../delete-user.command';
import { Inject, NotFoundException } from '@nestjs/common';
import { EB, EVENT_BUS, SnowflakeService, UserDTO, type IEventBus, UserErrors } from 'src/lib/common';
import { UserRepository } from 'src/lib/database';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private userRepository: UserRepository,
    @Inject(EVENT_BUS) protected readonly eventBus: IEventBus,
  ) { }

  async execute(command: DeleteUserCommand) {
    const user: UserDTO | null = await this.userRepository.deleteUser(command.id);
    if (!user) throw new NotFoundException({ code: UserErrors.NOT_FOUND, message: 'User not found' });
    await this.eventBus.publish(EB.CHANNEL.USER, {
      type: EB.USER.DELETED,
      data: {
        id: user.id
      }
    });
    return user;
  }
}
