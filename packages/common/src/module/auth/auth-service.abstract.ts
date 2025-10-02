import { JwtSignOptions } from '@nestjs/jwt';

import {
  AccessPayload,
  RefreshPayload,
  UserPayload,
  getAccessTtl,
  getRefreshTtl,
  normalizeKeyFromEnv,
  newJti,
  getBotAccessTtl,
  IEventBus,
  Snowflake,
  requireEnv,
  IRedisAuthService,
  UserDTO,
  EB
} from '../..';
import {
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import * as speakeasy from "speakeasy";
import { JwtService } from './jwt.service';
import * as bcrypt from 'bcrypt';

export async function hash(password: string, saltOrRounds: number) {
  return await bcrypt.hash(password, saltOrRounds);
}

export async function compare(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}


/**
 * Abstract AuthService containing core JWT/Redis logic.
 * 
 * - Always uses RS256 (asymmetric signing with private/public key pair).
 * - Handles issuing token pairs (access + refresh).
 * - Stores refresh tokens in Redis with TTL.
 * - Provides verification helpers for refresh tokens.
 */
export abstract class AuthServiceAbstract {
  constructor(
    protected readonly jwt: JwtService,
    protected readonly redisService: IRedisAuthService,
    protected readonly eventBus: IEventBus
  ) { }

  // ---------- JWT Signing Helpers ----------

  /**
   * Returns signing options for access/refresh tokens.
   * Always uses RS256 (private key for signing).
   * @param isRefresh Whether the token is a refresh token.
   */
  protected getSignKeyAndOpts(isRefresh: boolean): JwtSignOptions {
    const privateKey = normalizeKeyFromEnv(process.env.JWT_PRIVATE_KEY);
    if (!privateKey) {
      throw new InternalServerErrorException('Missing JWT_PRIVATE_KEY for RS256');
    }

    return {
      algorithm: 'RS256',
      privateKey,
      expiresIn: isRefresh ? getRefreshTtl() : getAccessTtl(),
    };
  }

  /**
   * Sign and return an access token.
   */
  protected async signAccess(payload: AccessPayload): Promise<string> {
    const opts = this.getSignKeyAndOpts(false);
    return this.jwt.signAsync(payload, opts);
  }

  /**
   * Sign and return a refresh token.
   */
  protected async signRefresh(payload: RefreshPayload): Promise<string> {
    const opts = this.getSignKeyAndOpts(true);
    return this.jwt.signAsync(payload, opts);
  }

  // ---------- Token Issuing ----------

  /**
   * Issues a new pair of tokens (access + refresh) for the given user.
   * 
   * - Access token: short-lived (e.g. 15m).
   * - Refresh token: longer-lived (e.g. 7d).
   * - Refresh is stored in Redis with TTL to allow revocation.
   */
  protected async issuePair(user: UserPayload, expiresIn = getAccessTtl()) {
    const aid = newJti();
    const rid = newJti();

    const accessPayload: AccessPayload = { ...user, type: 'access', jti: aid };
    const refreshPayload: RefreshPayload = { ...user, type: 'refresh', jti: rid, aid };

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccess(accessPayload),
      this.signRefresh(refreshPayload),
    ]);


    return {
      payload: {
        accessPayload,
        refreshPayload
      },
      pair: {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        ATExpiresIn: expiresIn,
        RTExpiresIn: getRefreshTtl(),
      }
    };
  }

  // ---------- Verification ----------

  /**
   * Verifies a refresh token with RS256 public key.
   * Ensures:
   * - Signature is valid.
   * - Token is not expired.
   * - Token is of type "refresh".
   * 
   * @throws UnauthorizedException if verification fails.
   */
  protected async verifyRefresh(token: string): Promise<RefreshPayload> {
    const publicKey = normalizeKeyFromEnv(process.env.JWT_PUBLIC_KEY);
    if (!publicKey) {
      throw new InternalServerErrorException('Missing JWT_PUBLIC_KEY for RS256');
    }

    let decoded: RefreshPayload;
    try {
      decoded = await this.jwt.verifyAsync<RefreshPayload>(token, {
        algorithms: ['RS256'],
        publicKey,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (decoded.type !== 'refresh') {
      throw new BadRequestException('Invalid token type: expected refresh');
    }

    return decoded;
  }

  /**
   * Generates a JWT token specifically for bot authentication
   * @param data - Object containing bot ID and optional roles
   * @param data.id - The bot's unique identifier
   * @param data.roles - Optional array or string of role permissions
   * @returns Promise resolving to authentication token response object
   */
  protected async generateJwtForBot(data: { id: string }): Promise<any> {
    const jti = newJti();
    const ttl = getBotAccessTtl();

    const payload: AccessPayload = {
      sub: data.id,
      client: 'bot',
      type: 'access',
      jti: jti,
    };

    // Step 1: Generate a fresh token
    const issuePair = await this.issuePair(payload, ttl);
    const accessToken = issuePair.pair.accessToken;
    // can be ignore other information

    // Step 2: (Delete/ Save) replace all previous sessions for this bot
    await this.redisService.replaceBotSession(payload.client, payload.sub, jti, ttl)
    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: ttl,
    };
  }


  // ---------- Send Email helper ----------
  protected async sendEmailConfirmation(id: Snowflake, user: UserDTO) {
    const TTL = 1000 * 60 * 60 * 24; // 1d
    const confirmToken = this.jwt.sign(
      { sub: String(id), email: user.email, action: EB.EMAIL_AUTH.CONFIRM_EMAIL },
      { expiresIn: TTL, secret: process.env.JWT_SECRET }
    );

    await this.eventBus.publish(EB.CHANNEL.EMAIL, {
      type: EB.EMAIL_AUTH.CONFIRM_EMAIL,
      data: {
        token: confirmToken,
        confirmUrl: `${process.env.FRONTEND_URL}/auth/confirm/${confirmToken}`,
        email: user.email,
        username: user.username
      },
    });
  }

  protected async confirmEmailRegister(token: string) {
    try {
      // 1. Verify token
      const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET });

      if (payload.action !== EB.EMAIL_AUTH.CONFIRM_EMAIL) throw new UnauthorizedException();

      // 2. Publish event
      await this.eventBus.publish(EB.CHANNEL.EMAIL, {
        type: EB.EMAIL_AUTH.CONFIRM_EMAIL,
        data: {
          userId: payload.sub,
          email: payload.email
        }
      });

      return { message: "Email confirmed." };
    } catch (e) {
      throw new UnauthorizedException("Invalid or expired confirmation token");
    }
  }
  // ----- OTP
  protected async sendEmailResetPassword(id: Snowflake, email: string) {
    const TTL = 60 * 15; // 15 min
    // Generate code
    const code = speakeasy.totp({
      secret: requireEnv("OTP_SECRET_CODE"),
      digits: 6,
      step: Number(process.env.OTP_STEP_TIME) ?? 1800,
      encoding: "base32",
    });

    // Send reset email
    await this.eventBus.publish(EB.CHANNEL.EMAIL, {
      type: EB.EMAIL_AUTH.RESET_PASSWORD,
      data: { email, code },
    });
  }

  protected async checkOTP(code: string) {
    return speakeasy.totp.verify({
      secret: requireEnv("OTP_SECRET_CODE"),
      token: code,
      digits: 6,
      step: Number(process.env.OTP_STEP_TIME) ?? 1800,
      encoding: "base32",
    });
  }

}
