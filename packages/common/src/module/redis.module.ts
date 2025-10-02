import { Module } from "@nestjs/common";
import { AbstractRedis, AbstractRedisAuth, RedisEventBus } from "../services";
import { REDIS_AUTH_SERVICE, REDIS_PUBSUB_SERVICE, REDIS_SERVICE } from "../interfaces";
import Redis from "ioredis";

class RedisServiceImpl extends AbstractRedis {}
class RedisPubSubImpl extends RedisEventBus {}
class RedisAuthImpl extends AbstractRedisAuth {}

@Module({
  providers: [
    { // Unique instance 
      provide: 'REDIS_CLIENT',
      useFactory: () => new Redis(process.env.REDIS_URL??  'redis://localhost:6379'),
    },
    {
      provide: REDIS_SERVICE,
      inject: ['REDIS_CLIENT'],
      useFactory: (client: Redis) => new RedisServiceImpl(client),
    },
    { // Finaly two instance, client/subscriber
      provide: REDIS_PUBSUB_SERVICE,
      inject: ['REDIS_CLIENT'],
      useFactory: (client: Redis) => new RedisPubSubImpl(client),
    },
    {
      provide: REDIS_AUTH_SERVICE,
      inject: ['REDIS_CLIENT'],
      useFactory: (client: Redis) => new RedisAuthImpl(client),
    },
  ],
  exports: [REDIS_SERVICE, REDIS_PUBSUB_SERVICE, REDIS_AUTH_SERVICE],
})
export class RedisModule {}