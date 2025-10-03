import { Module } from '@nestjs/common';
import { AuthCommonModule, EventBusModule, RedisModule } from 'src/lib/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    AuthCommonModule,
    UserModule,
    RedisModule,
    EventBusModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // UserService
    // { provide: 'UserService', useExisting: UserService },
  ],
}
)
export class AuthModule { }
