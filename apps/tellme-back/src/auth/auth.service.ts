import { BadRequestException, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { type IRedisAuthService, REDIS_AUTH_SERVICE, USER_SERVICE, type IUserService, type UserDTO, EVENT_BUS, type IEventBus, JwtService, AuthServiceAbstract, RegisterDto, UserPayload, Snowflake, LoginDto, RefreshPayload, getRefreshWindowSeconds, ResetPasswordConfirmationDto, BotDTO, buildRedisCacheKeyUserSession, generateCsrfToken, validateCsrfToken } from '@tellme/common';
import { decode } from 'punycode';

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
        if (user.email) this.sendEmailConfirmation(user.id, user);
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

        if (user.email) this.sendEmailConfirmation(user.id, user);
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
            if (user.email) this.sendEmailConfirmation(user.id, user);
            throw new UnauthorizedException('Account not confirmed, confirmation email resent.');
        }

        const payload: UserPayload = { sub: String(user.id), email: user.email, client: 'user' };
        const issuePair = await this.issuePair(payload);
        const rp = issuePair.payload.refreshPayload;
        const ap = issuePair.payload.accessPayload;
        const pair = issuePair.pair;

        // Store refresh in Redis (key = session, value = userId), TTL = refresh duration
        await this.redisAuthService.setJSON(buildRedisCacheKeyUserSession(rp.sub, rp.client, rp.jti), { uid: rp.sub }, pair.RTExpiresIn);

        // Generate CSRF token
        const rpCsrfToken = generateCsrfToken(rp.jti);
        const apCsrfToken = generateCsrfToken(ap.jti);
        return { pair, refreshCsrfToken: rpCsrfToken, accessCsrfToken: apCsrfToken, user };
    }

    /**
     * Refresh the access token using a valid refresh token.
     *
     * Workflow:
     * 1. Validate the refresh token's signature (JWT).
     * 2. Ensure the refresh token still exists in Redis (not revoked/rotated out).
     * 3. Validate the CSRF token using the refresh token's JTI.
     * 4. Invalidate the old refresh token in Redis (rotation).
     * 5. Issue a new access/refresh token pair.
     * 6. Store the new refresh token in Redis with its TTL.
     *
     * @param refreshToken - The refresh token provided by the client.
     * @param xCsrfToken - CSRF token to protect against cross-site request forgery.
     * @returns A new pair of tokens: accessToken, refreshToken, ATExpiresIn, RTExpiresIn.
     * @throws UnauthorizedException - If the refresh token is invalid, expired, or revoked.
     * @throws ForbiddenException - If the CSRF token does not match the refresh token's JTI.
     */
    async refresh(refreshToken: string, xCsrfToken: string) {
        // 1) Decode and verify the refresh token signature
        let decodedRefresh: RefreshPayload | null = null;
        try {
            decodedRefresh = await this.verifyRefresh(refreshToken);
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token.');
        }

        // 2) Verify the refresh token still exists in Redis (active session)
        const redisKey = buildRedisCacheKeyUserSession(
            decodedRefresh.sub,
            decodedRefresh.client,
            decodedRefresh.jti,
        );

        const session = await this.redisAuthService.getJSON(redisKey);
        if (!session) {
            throw new UnauthorizedException('Refresh token is invalid or has been revoked.');
        }
        // 3) Validate CSRF token against refresh token's JTI
        if (!validateCsrfToken(xCsrfToken, decodedRefresh.jti)) {
            throw new ForbiddenException('Invalid CSRF token.');
        }

        // 4) Invalidate the old refresh token in Redis (rotation)
        await this.redisAuthService.del(redisKey);

        // 5) Issue a new access/refresh token pair
        const payload: UserPayload = {
            sub: String(decodedRefresh.sub),
            email: decodedRefresh.email,
            roles: decodedRefresh.roles,
            client: decodedRefresh.client,
        };

        const issuePair = await this.issuePair(payload);
        const rp = issuePair.payload.refreshPayload;
        const ap = issuePair.payload.accessPayload;
        const pair = issuePair.pair;

        // 6) Store the new refresh token in Redis with its TTL
        await this.redisAuthService.setJSON(
            buildRedisCacheKeyUserSession(rp.sub, rp.client, rp.jti),
            { uid: rp.sub },
            pair.RTExpiresIn, // refresh token time-to-live
        );

        // Generate CSRF token
        const rpCsrfToken = generateCsrfToken(rp.jti);
        const apCsrfToken = generateCsrfToken(ap.jti);
        return { pair, refreshCsrfToken: rpCsrfToken, accessCsrfToken: apCsrfToken };
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
