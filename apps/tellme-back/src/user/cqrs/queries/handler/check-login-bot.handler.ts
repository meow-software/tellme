import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CheckLoginBotQuery } from '../check-login-bot.query';
import { UnauthorizedException } from '@nestjs/common';
import { AuthErrors } from 'src/lib/common';
import { UserRepository } from 'src/lib/database';

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
        if (!user) throw new UnauthorizedException({ code: AuthErrors.INVALID_BOT_CREDENTIALS, message: 'Invalid bot credentials.' });
        return user;
    }
}
