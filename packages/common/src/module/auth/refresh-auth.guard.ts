import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const refreshToken = request.body?.refresh_token || request.cookies["refresh_token"] ;
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token is missing.');
        }  
        const refreshXCsrfHeader = request.body?.x_csrf_token || request.headers['x-csrf-token']  ;
        if (!refreshXCsrfHeader) {
            throw new UnauthorizedException('Refresh x-csrf-token is missing.');
        }
        request.refreshToken = refreshToken;
        request.refreshXCsrfHeader = refreshXCsrfHeader;
        return true;
    }
}
