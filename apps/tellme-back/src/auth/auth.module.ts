import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthCommonModule } from '@tellme/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { DatabaseService, UserRepository } from '@tellme/database';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    AuthCommonModule,
    UserModule
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
