import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseService, RepositoryModule, UserRepository } from '@tellme/database';
import { UserController } from './user.controller';
import { EventBusModule, SnowflakeService, USER_SERVICE } from '@tellme/common';
import { CreateUserHandler } from './cqrs/commands/handlers/create-user.handler';
import { DeleteUserHandler } from './cqrs/commands/handlers/delete-user.handler';
import { UpdateUserHandler } from './cqrs/commands/handlers/update-user.handler';
import { CheckLoginBotHandler } from './cqrs/queries/handler/check-login-bot.handler';
import { CheckLoginHandler } from './cqrs/queries/handler/check-login.handler';
import { FindUserByIdHandler } from './cqrs/queries/handler/find-user-by-id.handler';
import { SearchUsersHandler } from './cqrs/queries/handler/search-users.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule, 
    EventBusModule,
    RepositoryModule,
  ],
  providers: [
    UserService,
    { provide: USER_SERVICE, useExisting: UserService }, 
    // UserRepository,
    // DatabaseService,
    SnowflakeService,
    
    // CQRS
    // Commands
    CreateUserHandler,
    DeleteUserHandler,
    UpdateUserHandler,
    // Queries
    CheckLoginBotHandler,
    CheckLoginHandler,
    FindUserByIdHandler,
    SearchUsersHandler
  ],
  controllers: [UserController],
  exports: [
    USER_SERVICE
  ]
})
export class UserModule {}
