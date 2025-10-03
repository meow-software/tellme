import { BadRequestException, Body, Controller, Get, HttpCode, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthErrors, ClientCredentialsDto, JwtAuthGuard, LoginDto, RegisterDto, ResendConfirmationDto, ResetPasswordConfirmationDto, ResetPasswordDemandDto, RefreshTokenGuard } from 'src/lib/common';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.registerUser(dto);
    }

    @Get('register/confirm')
    async confirmRegister(@Query('token') token: string) {
        if (!token) throw new BadRequestException({
            code: AuthErrors.TOKEN_REQUIRED,
            message: 'Token required'
        });
        return this.authService.confirmRegister(token);
    }

    @Post('register/confirm/resend')
    async resendConfirmRegister(@Body() dto: ResendConfirmationDto,
        @Req() req: Request
    ) {
        return this.authService.resendEmailConfirmRegister(dto.id, req.headers);
    }

    private buildSession(res, pair, refreshCsrfToken, accessCsrfToken) {
        res.cookie('access_token', pair.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: pair.ATExpiresIn * 1000,
        });
        res.cookie('refresh_token', pair.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: pair.RTExpiresIn * 1000,
        });
        // Return CSRF token for client
        return { refreshCsrfToken, accessCsrfToken };
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { pair, refreshCsrfToken, accessCsrfToken, user } = await this.authService.login(dto);
        // Return CSRF token for client
        return { ...this.buildSession(res, pair, refreshCsrfToken, accessCsrfToken), user };
    }

    @Post('bot/login')
    @HttpCode(200)
    async loginBot(@Body() dto: ClientCredentialsDto) {
        return this.authService.getBotToken(dto.id, dto.clientSecret);
    }

    @UseGuards(RefreshTokenGuard)  
    @Post('refresh')
    @HttpCode(200)
    async refresh(
        @Req() req: any,
        @Res({ passthrough: true }) res: Response
    ) {
        // Refresh must be send by body or coockie, check RefreshTokenGuard
        const { pair, refreshCsrfToken, accessCsrfToken } = await this.authService.refresh(req.refreshToken, req.refreshXCsrfHeader);
        // Return CSRF token for client
        return this.buildSession(res, pair, refreshCsrfToken, accessCsrfToken);
    }

    @Post('reset-password/demand')
    async resetPasswordDemand(
        @Body() dto: ResetPasswordDemandDto,
        @Req() req: Request) {
        return this.authService.resetPasswordDemand(dto.id, req.headers);
    }


    @UseGuards(JwtAuthGuard)
    @Post('reset-password/confirmation')
    async resetPasswordConfirmation(
        @Body() dto: ResetPasswordConfirmationDto,
        @Req() req: Request
    ) {
        return this.authService.resetPasswordConfirmation(dto, req.headers);
    }


    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        let refreshToken;
        try {
            // get refresh token
            const cookies = (req as any).cookies;
            refreshToken = cookies['refresh_token'];

            if (!refreshToken) {
                throw new BadRequestException({
                    code: AuthErrors.NO_REFRESH_TOKEN,
                    message: 'No refresh token found'
                });
            }
        } catch (e) {
            console.log('cookie: ', (req as any).cookies) // TODO : verifier 
            console.log("DEBUG: Logout pas de refreshtoken?")
        }
        // remove coockie
        res.clearCookie('access_token', { httpOnly: true, sameSite: 'strict' })
        res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'strict' })
        return this.authService.logout(refreshToken);
    }
}
