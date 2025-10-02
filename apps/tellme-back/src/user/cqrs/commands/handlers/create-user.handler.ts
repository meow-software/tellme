import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { ConflictException, Inject } from '@nestjs/common';
import { UserRepository } from '@tellme/database';
import { EB, EVENT_BUS, hash, type IEventBus, SnowflakeService } from '@tellme/common';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userRepository: UserRepository,
    private snowflake: SnowflakeService,
    @Inject(EVENT_BUS) protected readonly eventBus: IEventBus,
  ) { }

  async execute(command: CreateUserCommand) {
    // Hash password
    const hashedPassword = await hash(command.password, Number(process.env.PASSWORD_SALT_ROUNDS) ?? 10);
    // can be create
    let user;
    try {
      user = await this.userRepository.createUser({
        id: this.snowflake.generate(),
        username: command.username,
        email: command.email,
        hashedPassword: hashedPassword,
      }
      );
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('Username or email already exists.');
      }
    }
    await this.eventBus.publish(EB.CHANNEL.USER, {
      type: EB.USER.CREATED,
      data: {
        id: this.snowflake.toString(user.id),
        username: user.username,
        email: user.email,
      }
    });

    return user;
  }
}