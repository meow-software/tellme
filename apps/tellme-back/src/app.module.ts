import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: [
      //   path.resolve(__dirname, '../../../.env'), // turbo .env
      //   path.resolve(__dirname, './.env'), // local .env
      // ]
    }),  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
