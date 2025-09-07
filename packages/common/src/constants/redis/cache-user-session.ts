import {UserClientType} from "@tellme/ws-core";

export const REDIS_CACHE_USER_SESSION = `USER:SESSION:`;

/**
 * Constructs the Redis cache key for a user's session.
 *
 * Example:
 * ```ts
 * const key = redisCacheKeyGetUserSession("12345", "user");
 * console.log(key); // "USER:SESSION:user:12345:"
 * ```
 *
 * @param {string} userId - The ID of the user.
 * @param {UserClientType} clientType - Type of client user.
 * @returns {string} The Redis cache key for the user's session.
 */
export const redisCacheKeyGetUserSession = (userId: string, clientType: UserClientType): string => {
    return `${REDIS_CACHE_USER_SESSION}${clientType}:${userId}:`;
}

/**
 * Constructs the Redis cache key for storing a user session token.
 *
 * Example:
 * ```ts
 * const key = redisCacheKeyPutUserSession("12345", "user", "token_abc");
 * console.log(key); // "USER:SESSION:user:12345:token_abc"
 * 
 * // Example usage with ioredis:
 * await redis.set(key, JSON.stringify({ isActive: true }), "EX", 3600);
 * ```
 *
 * @param {string} userId - The ID of the user.
 * @param {UserClientType} clientType - Type of client user.
 * @param {string} token - The session token to store.
 * @returns {string} The Redis cache key where the token should be stored.
 */
export const redisCacheKeyPutUserSession = (userId: string, clientType: UserClientType, token: string): string => {
    const key = `${REDIS_CACHE_USER_SESSION}${clientType}:${userId}:${token}`;
    return key;
}

