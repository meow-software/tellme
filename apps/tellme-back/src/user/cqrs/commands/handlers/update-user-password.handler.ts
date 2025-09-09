import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { UserRepository } from '@tellme/database';
import { compare, hash } from '@tellme/common';
import { UpdateUserPasswordCommand } from '../update-user-password.command';

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordHandler implements ICommandHandler<UpdateUserPasswordCommand> {
  constructor(
    private userRepository: UserRepository,
  ) {}

  async execute(command: UpdateUserPasswordCommand) {
    const user = await this.userRepository.raw.findFirst({ where: { id : BigInt(command.userId) }});
    if (!user) throw new BadRequestException('User not found');
    if (await compare( command.oldPassword, user.password)) throw new BadRequestException('Invalid old password');

    // Hash password
    const hashedPassword = await hash(command.password, Number(process.env.PASSWORD_SALT_ROUNDS) ?? 10);
    
    this.userRepository.update(user.id, {
      password: hashedPassword,
    });
    return {edited: true, message: 'Password updated successfully!'};
  }
}