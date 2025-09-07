import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseService, UserRepository } from '@tellme/database';
import { UserController } from './user.controller';

@Module({
  providers: [
    UserService, 
    UserRepository,
    DatabaseService
  ],
  controllers: [UserController]
})
export class UserModule {}
