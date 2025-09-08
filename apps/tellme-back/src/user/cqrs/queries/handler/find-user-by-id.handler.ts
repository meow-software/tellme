import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByIdQuery } from '../find-user-by-id.query';
import {SnowflakeService, buildRedisCacheKeyUser, REDIS_CACHE_USER_TTL, REDIS_SERVICE, type IRedisService} from '@tellme/common';
import { UserRepository } from '@tellme/database'
import { Inject } from '@nestjs/common';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<FindUserByIdQuery> {
    private CACHE_TTL = REDIS_CACHE_USER_TTL;
    constructor(
        private userRepository: UserRepository, 
        private snowflake: SnowflakeService, 
        @Inject(REDIS_SERVICE) private readonly redisService: IRedisService,
    ) { }

    async execute(query: FindUserByIdQuery) {
        let { id, full } = query;
        const key = buildRedisCacheKeyUser(id);
        let user, cached;

        if (!full) cached = await this.redisService.getJSON(key);
        if (cached) user = cached;
        else {
            let _id = this.snowflake.toBigInt(id);
            const select = full
                ? { id: true, username: true, email: true }
                : { id: true, username: true };
                
            user = await this.userRepository.findUnique({ where: { id: _id }, select });
            if (!full && user) {
                cached = { ...user, id: this.snowflake.toString(user.id) };
            } // cached is already null
        }
        // Refresh cache with old data of user or new data of user
        if (cached) await this.redisService.setJSON(key, cached, this.CACHE_TTL);
        return user;
    }
}
