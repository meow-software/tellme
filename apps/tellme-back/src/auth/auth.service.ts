import { Inject, Injectable } from '@nestjs/common';
import type { IUserService, UserDTO } from '@tellme/common';
// import { AbstractRedisAuth } from "@tellme/common";

@Injectable()
export class AuthService  {
    protected userServiceTarget: string = "/users";
    constructor(
        // protected readonly jwt: JwtService,
        // protected readonly redis: RedisService,
        @Inject('UserService') private readonly userService: IUserService,
        // @Inject(eventBusInterface.EVENT_BUS) protected readonly eventBus: eventBusInterface.IEventBus,
    ) {
        // super(jwt, redis, eventBus);
    }

  async findById(id: string): Promise<UserDTO | null> {
    return this.userService.findById(id);  
  } 
}