import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { validateCsrfToken } from './tokens.util';

@Injectable()
export class CsrfGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
        const req = ctx.switchToHttp().getRequest();

        const csrfHeader = req.headers['x-csrf-token'];
        const user = req.user; // Injected by JwtAuthGuard
        if (!user || !user.jti) throw console.log('DEBUG: csrf - jti introuvable? user: ', user);
        const sessionId = user?.jti;

        if (!csrfHeader || !sessionId) {
            throw new ForbiddenException('CSRF token missing or invalid');
        }

        if (!validateCsrfToken(csrfHeader as string, sessionId)) {
            throw new ForbiddenException('CSRF token mismatch');
        }

        return true;
    }
}
