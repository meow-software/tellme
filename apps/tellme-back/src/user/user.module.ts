import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseService, RepositoryModule, UserRepository } from 'src/lib/database';
import { UserController } from './user.controller';
import { EventBusModule, RedisModule, SnowflakeService, USER_SERVICE } from 'src/lib/common';
// import { CreateUserHandler } from './cqrs/commands/handlers/create-user.handler';
// import { DeleteUserHandler } from './cqrs/commands/handlers/delete-user.handler';
// import { UpdateUserHandler } from './cqrs/commands/handlers/update-user.handler';
// import { CheckLoginBotHandler } from './cqrs/queries/handler/check-login-bot.handler';
// import { CheckLoginHandler } from './cqrs/queries/handler/check-login.handler';
import { FindUserByIdHandler } from './cqrs/queries/handler/find-user-by-id.handler';
// import { SearchUsersHandler } from './cqrs/queries/handler/search-users.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './cqrs/commands/handlers/create-user.handler';
import { DeleteUserHandler } from './cqrs/commands/handlers/delete-user.handler';
import { UpdateUserHandler } from './cqrs/commands/handlers/update-user.handler';
import { CheckLoginBotHandler } from './cqrs/queries/handler/check-login-bot.handler';
import { CheckLoginHandler } from './cqrs/queries/handler/check-login.handler';
import { SearchUsersHandler } from './cqrs/queries/handler/search-users.handler';
import { UpdateUserPasswordHandler } from './cqrs/commands/handlers/update-user-password.handler';

@Module({
  imports: [
    CqrsModule, 
    EventBusModule,
    RepositoryModule,
    RedisModule,
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
    UpdateUserPasswordHandler,
    // Queries
    CheckLoginBotHandler,
    CheckLoginHandler,
    SearchUsersHandler,
    FindUserByIdHandler,
  ],
  controllers: [UserController],
  exports: [
    USER_SERVICE
  ]
})
export class UserModule {} 
