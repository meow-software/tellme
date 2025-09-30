import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from './jwt.service';
import { RefreshTokenGuard } from './refresh-auth.guard';
import { JwtCsrfGuard } from './jwt-csrf-auth.guard';
import { CsrfGuard } from './csrf-auth.guard';


@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy, JwtAuthGuard, JwtService, CsrfGuard, RefreshTokenGuard, JwtCsrfGuard],
  exports: [PassportModule, JwtStrategy, JwtAuthGuard, JwtService, CsrfGuard, RefreshTokenGuard, JwtCsrfGuard],})
export class AuthCommonModule {}
