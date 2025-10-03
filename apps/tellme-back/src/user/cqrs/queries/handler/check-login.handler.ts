import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CheckLoginQuery } from '../check-login.query';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/lib/database';
import { AuthErrors, compare } from 'src/lib/common';

@QueryHandler(CheckLoginQuery)
export class CheckLoginHandler implements IQueryHandler<CheckLoginQuery> {
    constructor(private usersRepo: UserRepository) { }
    async execute(query: CheckLoginQuery) {
        const { usernameOrEmail, password } = query;

        const user = await this.usersRepo.raw.findFirst({
            where: {
                OR: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail },
                ],
            },
        });

        if (!user || !(await compare(password, user.password))) throw new UnauthorizedException({ code: AuthErrors.INVALID_USER_CREDENTIALS, message: 'Invalid user credentials.' });
        return this.usersRepo.pTIUser(user);
    }
}
