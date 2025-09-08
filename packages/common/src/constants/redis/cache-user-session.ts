import {UserClientType} from "../../module";

export const REDIS_CACHE_USER_SESSION = `USER:SESSION:`;

/**
 * Constructs the Redis cache key for a user's session.
 *
 * Example:
 * ```ts
 * const key = buildRedisCacheKeyUserSession("12345", "user", "token_abc");
 * console.log(key); // "USER:SESSION:user:12345:token_abc"
 * 
 * // Example usage with ioredis:
 * await redis.set(key, JSON.stringify({ isActive: true }), "EX", 3600);
 * ```
 *
 * @param {string | bigint} userId - The ID of the user.
 * @param {UserClientType} clientType - Type of client user.
 * @param {string} token - The session token to store.
 * @returns {string} The Redis cache key where the token should be stored.
 */
export const buildRedisCacheKeyUserSession = (userId: string | bigint, clientType: UserClientType, token: string): string => {
    return `${REDIS_CACHE_USER_SESSION}${clientType}:${userId.toString()}:${token}`;
}

