import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseService, UserRepository } from '@tellme/database';
import { UserController } from './user.controller';
import { USER_SERVICE } from '@tellme/common';

@Module({
  providers: [
    UserService,
    { provide: USER_SERVICE, useExisting: UserService }, 
    UserRepository,
    DatabaseService
  ],
  controllers: [UserController],
  exports: [
    USER_SERVICE
  ]
})
export class UserModule {}
