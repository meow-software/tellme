import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseService, UserRepository } from '@tellme/database';
import { UserController } from './user.controller';
import { EventBusModule, SnowflakeService, USER_SERVICE } from '@tellme/common';
import { CreateUserHandler } from './cqrs/commands/handlers/create-user.handler';
import { DeleteUserHandler } from './cqrs/commands/handlers/delete-user.handler';
import { UpdateUserHandler } from './cqrs/commands/handlers/update-user.handler';
import { CheckLoginBotHandler } from './cqrs/queries/handler/check-login-bot.handler';
import { CheckLoginHandler } from './cqrs/queries/handler/check-login.handler';
import { GetUserHandler } from './cqrs/queries/handler/get-user.handler';
import { SearchUsersHandler } from './cqrs/queries/handler/search-users.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule, 
    EventBusModule,
  ],
  providers: [
    UserService,
    { provide: USER_SERVICE, useExisting: UserService }, 
    UserRepository,
    DatabaseService,
    SnowflakeService,
    
    // CQRS
    // Commands
    CreateUserHandler,
    DeleteUserHandler,
    UpdateUserHandler,
    // Queries
    CheckLoginBotHandler,
    CheckLoginHandler,
    GetUserHandler,
    SearchUsersHandler
  ],
  controllers: [UserController],
  exports: [
    USER_SERVICE
  ]
})
export class UserModule {}
