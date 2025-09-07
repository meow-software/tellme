import { BadRequestException, Body, Controller, Get, Headers, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientCredentialsDto, JwtAuthGuard, LoginDto, RefreshDto, RegisterDto, ResendConfirmationDto, ResetPasswordConfirmationDto, ResetPasswordDemandDto } from '@tellme/common';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        // return this.authService.register(dto);
        "register";
    }
/*
    @Get('register/confirm')
    async registerConfirm(@Query('token') token: string) {
        if (!token) throw new BadRequestException('Token required');
        return this.authService.confirmRegister(token);
    }

    @Post('register/confirm/resend')
    async resendConfirmation(@Body() dto: ResendConfirmationDto,
        @Req() req: Request
    ) {
        return this.authService.resendConfirmationEmail(dto.id, req.headers);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('bot/login')
    async getBotToken(@Body() dto: ClientCredentialsDto) {
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
        return this.authService.resetPasswordConfirmation(dto.code, dto.id, dto.password, dto.oldPassword, req.headers);
    }


    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Body() dto: RefreshDto, @Req() req: Request) {
        const accessJti = req.headers['x-access-jti'] as string | undefined;
        return this.authService.logout(dto.refreshToken, accessJti);
    }*/
}
