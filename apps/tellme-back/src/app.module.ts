import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthCommonModule } from '@tellme/common';
import { UserModule } from './user/user.module';
import { DatabaseService } from '@tellme/database';
import { NotificationModule } from './notification/notification.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,  
    AuthCommonModule, 
    UserModule, NotificationModule, EmailModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    DatabaseService,
  ],
  exports: [
    DatabaseService
  ]
})
export class AppModule {}
