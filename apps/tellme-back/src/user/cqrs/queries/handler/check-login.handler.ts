import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { CheckLoginQuery } from '../check-login.query';
import { UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/lib';

@QueryHandler(CheckLoginQuery)
export class CheckLoginHandler implements IQueryHandler<CheckLoginQuery> {
    constructor(private usersRepo: DatabaseService) { }
    async execute(query: CheckLoginQuery) {
        const { usernameOrEmail, password } = query;
        const repository = await this.usersRepo.user

        const user = await repository.findFirst({
            where: {
                OR: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail },
                ],
            },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedException('Invalid user credentials.');
        return user;
    }
}
