import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../get-user.query';
import {SnowflakeService, DatabaseService, redisCacheKeyUser, REDIS_CACHE_USER_TTL} from 'src/lib';
import { AtlasRedisService } from 'src/services/redis.service';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
    private CACHE_TTL = REDIS_CACHE_USER_TTL;
    constructor(private db: DatabaseService, private snowflake: SnowflakeService, private redis: AtlasRedisService) { }

    async execute(query: GetUserQuery) {
        let { id, full } = query;
        const key = redisCacheKeyUser(id);
        let user, cached;

        if (!full) cached = await this.redis.getJSON(key);
        if (cached) user = cached;
        else {
            let _id = this.snowflake.toBigInt(id);
            const select = full
                ? { id: true, username: true, email: true }
                : { id: true, username: true };
                
            user = await this.db.user.findUnique({ where: { id: _id }, select });
            if (!full && user) {
                cached = { ...user, id: this.snowflake.toString(user.id) };
            } // cached is already null
        }
        // Refresh cache with old data of user or new data of user
        if (cached) await this.redis.setJSON(key, cached, this.CACHE_TTL);
        return user;
    }
}
