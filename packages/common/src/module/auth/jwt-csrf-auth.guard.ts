import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CsrfGuard } from './csrf-auth.guard';

@Injectable()
export class JwtCsrfGuard implements CanActivate {
    constructor(
        private readonly jwtGuard: JwtAuthGuard,
        private readonly csrfGuard: CsrfGuard
    ) { }

    async canActivate(ctx: ExecutionContext) {
        const jwtValid = await this.jwtGuard.canActivate(ctx);
        if (!jwtValid) return false;

        const csrfValid = this.csrfGuard.canActivate(ctx);
        return csrfValid;
    }
}
