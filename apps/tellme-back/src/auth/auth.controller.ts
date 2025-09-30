import { BadRequestException, Body, Controller, Get, Headers, HttpCode, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientCredentialsDto, envIsProd, JwtAuthGuard, LoginDto, RefreshDto, RegisterDto, requireEnv, ResendConfirmationDto, ResetPasswordConfirmationDto, ResetPasswordDemandDto } from '@tellme/common';
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
        if (!token) throw new BadRequestException('Token required');
        return this.authService.confirmRegister(token);
    }

    @Post('register/confirm/resend')
    async resendConfirmRegister(@Body() dto: ResendConfirmationDto,
        @Req() req: Request
    ) {
        return this.authService.resendEmailConfirmRegister(dto.id, req.headers);
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { pair, csrfToken, user } = await this.authService.login(dto);
        
        // Send cookies
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
        return { csrfToken, user };
    }

    @Post('bot/login')
    @HttpCode(200)
    async loginBot(@Body() dto: ClientCredentialsDto) {
        return this.authService.getBotToken(dto.id, dto.clientSecret);
    }

    @UseGuards(JwtAuthGuard)
    @Post('refresh')
    async refresh(
        @Body() dto: RefreshDto,
        @Headers('authorization') authorization?: string) {
        const accessToken = authorization?.replace('Bearer ', '');
        return this.authService.refresh(dto.refreshToken, accessToken);
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
    async logout(@Req() req: Request,  @Res({ passthrough: true }) res: Response) {
        let refreshToken;
        try {
            // get refresh token
            const cookies = (req as any).cookies;
            refreshToken = cookies['refresh_token'];

            if (!refreshToken) {
                throw new BadRequestException('No refresh token found');
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
