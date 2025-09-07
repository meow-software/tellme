import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from './jwt.service';


@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy, JwtAuthGuard, JwtService],
  exports: [PassportModule, JwtStrategy, JwtAuthGuard, JwtService],})
export class AuthCommonModule {}
