import { BadRequestException, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { type IRedisAuthService, REDIS_AUTH_SERVICE, USER_SERVICE, type IUserService, type UserDTO, EVENT_BUS, type IEventBus, JwtService, AuthServiceAbstract, RegisterDto, UserPayload, Snowflake, LoginDto, RefreshPayload, getRefreshWindowSeconds, ResetPasswordConfirmationDto, BotDTO, buildRedisCacheKeyUserSession, generateCsrfToken } from '@tellme/common';

@Injectable()
export class AuthService extends AuthServiceAbstract {
    protected userServiceTarget: string = "/users";
    constructor(
        protected readonly jwt: JwtService,
        @Inject(REDIS_AUTH_SERVICE) private readonly redisAuthService: IRedisAuthService,
        @Inject(USER_SERVICE) private readonly userService: IUserService,
        @Inject(EVENT_BUS) protected readonly eventBus: IEventBus,
    ) {
        super(jwt, redisAuthService, eventBus);
    }

    async findById(id: string): Promise<UserDTO | null> {
        return this.userService.findById(id);
    }

    /**
     * Register: delegates user creation to the USER_SERVICE,
     * then issues an access/refresh token pair.
     */
    async registerUser(dto: RegisterDto) {
        const user = await this.userService.registerUser(dto) as UserDTO;
        if (!user) throw new BadRequestException('User registration failed.')
        if (user.email) this.sendEmailConfirmation(user.id, user.email);
        const payload: UserPayload = { sub: user.id.toString(), email: user.email, client: 'user' };
        return { ...this.issuePair(payload), message: "Check your email to confirm your account." };
    }

    async confirmRegister(token: string) {
        this.confirmEmailRegister(token);
    }

    async resendEmailConfirmRegister(id: Snowflake, header: any = {}) {
        const user = await this.userService.getMe({ id }) as UserDTO;

        if (!user) throw new BadRequestException("No user found with this id.");
        if (user.isConfirmed) {
            throw new BadRequestException("Account already confirmed.");
        }

        if (user.email) this.sendEmailConfirmation(user.id, user.email);
        return { success: true, message: "Confirmation email resent." };
    }


    /**
     * Login: delegates validation to the USER_SERVICE (check password),
     * then issues an access/refresh token pair.
     */
    async login(dto: LoginDto) {
        const user = await this.userService.checkLogin(dto) as UserDTO;

        if (!user) {
            throw new UnauthorizedException('Invalid credentials.');
        }
        if (!user.isConfirmed) {
            if (user.email) this.sendEmailConfirmation(user.id, user.email);
            throw new UnauthorizedException('Account not confirmed, confirmation email resent.');
        }

        const payload: UserPayload = { sub: String(user.id), email: user.email, client: 'user' };
        const issuePair = await this.issuePair(payload);
        const rp = issuePair.payload.refreshPayload;
        const pair = issuePair.pair;

        // Store refresh in Redis (key = session, value = userId), TTL = refresh duration
        await this.redisAuthService.setJSON(buildRedisCacheKeyUserSession(rp.sub, rp.client, rp.jti), { uid: rp.sub }, pair.RTExpiresIn);

        // Generate CSRF token
        const csrfToken = generateCsrfToken(rp.jti);
        return { pair, csrfToken };
    }

    /**
     * Refresh: requires both refresh token and (optionally) access token.
     * Rules:
     *  - Access token must be expired, but within REFRESH_WINDOW_SECONDS (default: 300s = 5 min).
     *  - Refresh token must still be valid.
     *  - If refresh is expired but access expired just recently (grace period),
     *    allow re-issuing tokens based on access claims.
     */
    async refresh(refreshToken: string, accessToken?: string) {
        const nowSec = Math.floor(Date.now() / 1000);

        // 1) Access token is mandatory for refresh.
        if (!accessToken) {
            throw new BadRequestException('Access token required for refresh.');
        }

        const decodedAccess: any = this.jwt.decode(accessToken);
        if (!decodedAccess || typeof decodedAccess.exp !== 'number') {
            throw new UnauthorizedException('Invalid access token provided.');
        }

        const exp = decodedAccess.exp as number;
        const expiredSince = nowSec - exp;

        // 2) Try to verify refresh token
        let decodedRefresh: RefreshPayload | null = null;
        try {
            decodedRefresh = await this.verifyRefresh(refreshToken);
        } catch {
            // Refresh invalid or expired → continue to fallback
        }

        // Case A: Refresh valid → normal workflow
        if (decodedRefresh) {
            if (exp > nowSec) {
                throw new ForbiddenException('Access token still valid — too early to refresh.');
            }
            if (expiredSince > getRefreshWindowSeconds()) {
                throw new ForbiddenException('Access expired too long ago — refresh window exceeded.');
            }

            // 1. Invalidate the old refresh token (rotation)
            await this.redisAuthService.del(buildRedisCacheKeyUserSession(decodedRefresh.sub, decodedRefresh.client, decodedRefresh.jti));

            // 2. Put new key
            const payload: UserPayload = { sub: String(decodedRefresh.sub), email: decodedRefresh.email, roles: decodedRefresh.roles, client: decodedRefresh.client };
            const issuePair = await this.issuePair(payload);
            const rp = issuePair.payload.refreshPayload;
            const pair = issuePair.pair;

            // Store refresh in Redis (key = session, value = userId), TTL = refresh duration
            await this.redisAuthService.setJSON(buildRedisCacheKeyUserSession(rp.sub, rp.client, rp.jti), { uid: rp.sub }, pair.RTExpiresIn);
            return pair;
        }

        // Case B: Refresh expired, but access just expired (grace period)
        if (expiredSince > 0 && expiredSince <= getRefreshWindowSeconds()) {
            const payload: UserPayload = { sub: String(decodedAccess.sub), email: decodedAccess.email, roles: decodedAccess.roles, client: decodedAccess.client };
            const issuePair = await this.issuePair(payload);
            const rp = issuePair.payload.refreshPayload;
            const pair = issuePair.pair;

            // Store refresh in Redis (key = session, value = userId), TTL = refresh duration
            await this.redisAuthService.setJSON(buildRedisCacheKeyUserSession(rp.sub, rp.client, rp.jti), { uid: rp.sub }, pair.RTExpiresIn);
            return pair;
        }

        // Case C: Both tokens invalid or outside allowed window
        throw new UnauthorizedException('Session expired — please log in again.');
    }


    /**
     * Reset password demand
     */
    async resetPasswordDemand(userId: Snowflake, ctx: any) {
        const user = await this.userService.getMe({ ...ctx, id: userId }) as UserDTO;
        if (!user) throw new BadRequestException("No user found with this email.");
        if (!user.email) throw new BadRequestException("User has no email, i can't help you.");

        this.sendEmailResetPassword(user.id, user.email);

        return { success: true, message: "Password reset link sent to your email!" };
    }

    /**
     * Reset password confirmation
     */
    async resetPasswordConfirmation(dto: ResetPasswordConfirmationDto, headers: any = {}) {
        // 1. Check OTP
        const match = this.checkOTP(dto.code);
        if (!match) return new UnauthorizedException("Invalid/expired token");

        // 2. Edit password
        return await this.userService.updatePassword(dto.id, dto.password, dto.oldPassword, headers);
    }

    /**
     * Logout: revokes the refresh token (deletes from Redis),
     * and optionally blacklists the current access token until its expiry.
     */
    async logout(refreshToken: string) {
        if (refreshToken) {
            try {
                const decoded = await this.verifyRefresh(refreshToken);
                await this.redisAuthService.del(buildRedisCacheKeyUserSession(decoded.sub, decoded.client, decoded.jti));
            } catch {
                // Refresh already invalid → ignore
            }
        }
        return 'Logged out';
    }

    /**
     * Validates bot credentials and generates a JWT access token for authenticated bots
     * @param id - The bot's client ID
     * @param token - The bot's token secret
     * @returns Promise resolving to an authentication token response
     * @throws UnauthorizedException if bot credentials are invalid
     */
    async getBotToken(id: string, token: string) {
        console.log("----l", id, token)
        const bot: UserDTO | null = await this.userService.checkBotLogin(id, token);
        if (!bot) throw new UnauthorizedException('Invalid bot credentials.');
        return this.generateJwtForBot({
            id: bot.id,
        });
    }
}
