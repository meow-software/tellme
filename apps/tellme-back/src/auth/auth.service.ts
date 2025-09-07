import { Inject, Injectable } from '@nestjs/common';
import { type IRedisAuthService, REDIS_AUTH_SERVICE, USER_SERVICE, type IUserService, type UserDTO, EVENT_BUS,  type IEventBus , JwtService} from '@tellme/common';
// import { AbstractRedisAuth } from "@tellme/common";

@Injectable()
export class AuthService  {
    protected userServiceTarget: string = "/users";
    constructor(
        protected readonly jwt: JwtService,
        @Inject(REDIS_AUTH_SERVICE) private readonly redisAuthService: IRedisAuthService,
        @Inject(USER_SERVICE) private readonly userService: IUserService,
        @Inject(EVENT_BUS) protected readonly eventBus: IEventBus,
    ) {
        // super(jwt, redis, eventBus);
    }

  async findById(id: string): Promise<UserDTO | null> {
    return this.userService.findById(id);  
  } 
}