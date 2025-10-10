import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { UserRepository } from 'src/lib/database';
import { compare, hash, AuthCodes } from 'src/lib/common';
import { UpdateUserPasswordCommand } from '../update-user-password.command';

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordHandler implements ICommandHandler<UpdateUserPasswordCommand> {
  constructor(
    private userRepository: UserRepository,
  ) {}

  async execute(command: UpdateUserPasswordCommand) {
    const user = await this.userRepository.raw.findFirst({ where: { id : BigInt(command.userId) }});
    if (!user || !user.password) throw new BadRequestException({ code: AuthCodes.NOT_FOUND, message: 'User not found' });
    if (await compare( command.oldPassword, user.password)) throw new BadRequestException({ code: AuthCodes.INVALID_OLD_PASSWORD, message: 'Invalid old password' });

    // Hash password
    const hashedPassword = await hash(command.password, Number(process.env.PASSWORD_SALT_ROUNDS) ?? 10);
    
    this.userRepository.update(user.id, {
      password: hashedPassword,
    });
    return {edited: true, code: AuthCodes.PASSWORD_UPDATED, message: 'Password updated successfully!'};
  }
}