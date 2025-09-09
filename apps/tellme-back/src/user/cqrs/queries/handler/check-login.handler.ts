import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CheckLoginQuery } from '../check-login.query';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@tellme/database';
import { compare } from '@tellme/common';

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

        if (!user || !(await compare(password, user.password))) throw new UnauthorizedException('Invalid user credentials.');
        return this.usersRepo.pTIUser(user);
    }
}
