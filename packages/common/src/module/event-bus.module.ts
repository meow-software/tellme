import { Module } from "@nestjs/common";
import { EVENT_BUS, IRedisPubSubService, REDIS_PUBSUB_SERVICE } from "../interfaces";
import { RedisEventBus } from "../services";
import { RedisModule } from "./redis.module";

class RedisEventBusService extends RedisEventBus {}

@Module({
  imports: [RedisModule], 
  providers: [
    {
      provide: EVENT_BUS,
      useFactory: (redisClient: IRedisPubSubService) => {
        return new RedisEventBusService(redisClient.redis); // Use Redis instance, have 1 redis instance or 2 for pub/sub
      },
      inject: [REDIS_PUBSUB_SERVICE],
    },
  ],
  exports: [EVENT_BUS],
})
export class EventBusModule {}
