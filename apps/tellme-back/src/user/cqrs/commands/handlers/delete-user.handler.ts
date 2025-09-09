
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../delete-user.command';
import { Inject, NotFoundException } from '@nestjs/common';
import { EB_USER_DELETED, EVENT_BUS, SnowflakeService, UserDTO, type IEventBus } from '@tellme/common';
import { UserRepository } from '@tellme/database';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private userRepository: UserRepository,
    @Inject(EVENT_BUS) protected readonly eventBus: IEventBus,
  ) { }

  async execute(command: DeleteUserCommand) {
    const user : UserDTO | null = await this.userRepository.deleteUser(command.id);
    if (!user) throw new NotFoundException('User not found');
    await this.eventBus.publish(EB_USER_DELETED, { id: user.id });
    return user;
  }
}
