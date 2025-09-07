import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthCommonModule } from '@tellme/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    AuthCommonModule
  ],
  controllers: [AuthController],
  providers: [AuthService],})
export class AuthModule {}
