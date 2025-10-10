import { BadRequestException, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { type IRedisAuthService, REDIS_AUTH_SERVICE, USER_SERVICE, type IUserService, type UserDTO, EVENT_BUS, type IEventBus, JwtService, AuthServiceAbstract, RegisterDto, UserPayload, Snowflake, LoginDto, RefreshPayload, getRefreshWindowSeconds, ResetPasswordConfirmationDto, BotDTO, buildRedisCacheKeyUserSession, generateCsrfToken, validateCsrfToken, AuthCodes, IAuthenticatedRequest, IRequest, SocialProviderDto, SocialProvider, OAuthUserPayload } from 'src/lib/common';

@Injectable()
export class AuthService extends AuthServiceAbstract {
    protected userServiceTarget: string = "/users";
    constructor(
        protected readonly jwt: JwtService,
        @Inject(REDIS_AUTH_SERVICE) private readonly redisAuthService: IRedisAuthService,
        @Inject(USER_SERVICE) private readonly userService: IUserService,
        @Inject(EVENT_BUS) protected readonly eventBus: IEventBus,
        private readonly socialProvider: SocialProvider
    ) {
        super(jwt, redisAuthService, eventBus);
    }

    async findById(id: string): Promise<UserDTO | null> {
        return this.userService.findById(id);
    }

    async checkSocialProvider(dto: SocialProviderDto) {
        const oauthUser = await this.socialProvider.validateSocialToken(dto.provider, dto.token);
        // le compte doit etre verified

        if (!!oauthUser.email || !!oauthUser.username) return {"error" : "error"};

        // get or create user by provider
        let user = await this.userService.getOrCreateOauthUser(
            {
                ...oauthUser as OAuthUserPayload,
            },
        );
        console.log(user);
        // createOAuthUser;

        // on peut generer son jwt
        return {user}
    }

    /**
     * Register: delegates user creation to the USER_SERVICE,
     * then issues an access/refresh token pair.
     */
    async registerUser(dto: RegisterDto, req: IAuthenticatedRequest) {
        const user = await this.userService.registerUser(dto, req) as UserDTO;
        if (!user) throw new BadRequestException({
            code: AuthCodes.INVALID_CREDENTIALS,
            message: 'User registration failed.'
        })
        if (user.email) this.sendEmailConfirmation(user.id, user);
        return { code: AuthCodes.CHECK_EMAIL_CONFIRMATION, message: "Check your email to confirm your account." };
    }

    async confirmRegister(token: string, req: IAuthenticatedRequest) {
        this.confirmEmailRegister(token, req.userlang);
    }

    async resendEmailConfirmRegister(id: Snowflake) {
        const user = await this.userService.findById(id) as UserDTO;

        if (!user) throw new BadRequestException({
            code: AuthCodes.NO_USER_WITH_ID,
            message: "No user found with this id."
        });
        if (user.isConfirmed) {
            throw new BadRequestException({
                code: AuthCodes.ACCOUNT_ALREADY_CONFIRMED,
                message: "Account already confirmed."
            });
        }

        if (user.email) this.sendEmailConfirmation(user.id, user);
        return { success: true, code: AuthCodes.CONFIRMATION_EMAIL_RESENT, message: "Confirmation email resent." };
    }


    /**
     * Login: delegates validation to the USER_SERVICE (check password),
     * then issues an access/refresh token pair.
     */
    async login(dto: LoginDto) {
        const user = await this.userService.checkLogin(dto) as UserDTO;

        if (!user) {
            throw new UnauthorizedException({
                code: AuthCodes.INVALID_CREDENTIALS,
                message: 'Invalid credentials.'
            });
        }
        if (!user.isConfirmed) {
            if (user.email) this.sendEmailConfirmation(user.id, user);
            throw new UnauthorizedException({
                code: AuthCodes.ACCOUNT_NOT_CONFIRMED,
                message: 'Account not confirmed, confirmation email resent.'
            });
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
            throw new UnauthorizedException({
                code: AuthCodes.INVALID_OR_EXPIRED_REFRESH_TOKEN,
                message: 'Invalid or expired refresh token.'
            });
        }

        // 2) Verify the refresh token still exists in Redis (active session)
        const redisKey = buildRedisCacheKeyUserSession(
            decodedRefresh.sub,
            decodedRefresh.client,
            decodedRefresh.jti,
        );

        const session = await this.redisAuthService.getJSON(redisKey);
        if (!session) {
            throw new UnauthorizedException({
                code: AuthCodes.REFRESH_TOKEN_INVALID_OR_REVOKED,
                message: 'Refresh token is invalid or has been revoked.'
            });
        }
        // 3) Validate CSRF token against refresh token's JTI
        if (!validateCsrfToken(xCsrfToken, decodedRefresh.jti)) {
            throw new ForbiddenException({
                code: AuthCodes.INVALID_CSRF_TOKEN,
                message: 'Invalid CSRF token.'
            });
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
    async resetPasswordDemand(userId: Snowflake, req: IAuthenticatedRequest) {
        const user = await this.userService.getMe(req) as UserDTO;
        if (!user) throw new BadRequestException({
            code: AuthCodes.NO_USER_WITH_EMAIL,
            message: "No user found with this email."
        });
        if (!user.email) throw new BadRequestException({
            code: AuthCodes.USER_HAS_NO_EMAIL,
            message: "User has no email, i can't help you."
        });

        this.sendEmailResetPassword(user.id, user.email, req.userlang);

        return { success: true, code: AuthCodes.PASSWORD_RESET_LINK_SENT, message: "Password reset link sent to your email!" };
    }

    /**
     * Reset password confirmation
     */
    async resetPasswordConfirmation(dto: ResetPasswordConfirmationDto, headers: any = {}) {
        // 1. Check OTP
        const match = this.checkOTP(dto.code);
        if (!match) throw new UnauthorizedException({
            code: AuthCodes.INVALID_EXPIRED_TOKEN,
            message: "Invalid or expired token!"
        });

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
        return { code: AuthCodes.LOGGED_OUT, message: 'You have been logged out.' };
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
        if (!bot) throw new UnauthorizedException({
            code: AuthCodes.INVALID_BOT_CREDENTIALS,
            message: 'Invalid bot credentials.'
        });
        return this.generateJwtForBot({
            id: bot.id,
        });
    }
}
