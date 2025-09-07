import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthCommonModule } from '@tellme/common';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: [
      //   path.resolve(__dirname, '../../../.env'), // turbo .env
      //   path.resolve(__dirname, './.env'), // local .env
      // ]
    }),
    AuthModule,  
    AuthCommonModule, UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
