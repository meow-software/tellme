import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CheckLoginBotQuery } from '../check-login-bot.query';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@tellme/database';

@QueryHandler(CheckLoginBotQuery)
export class CheckLoginBotHandler implements IQueryHandler<CheckLoginBotQuery> {
    constructor(
        private userRepository: UserRepository,
    ) { }
    async execute(query: CheckLoginBotQuery) {
        const { id, token } = query;
        const user = await this.userRepository.findFirst({
            where: {
                id: BigInt(id),
                bot: {
                    token: token,
                },
            },
            include: { bot: true },
        });
        if (!user) throw new UnauthorizedException('Invalid bot credentials.');
        return user;
    }
}
