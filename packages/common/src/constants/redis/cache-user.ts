import { Snowflake } from "@tellme/core";

export const REDIS_CACHE_USER = `USER:`;
export const REDIS_CACHE_USER_TTL = 60*5;

/**
 * Constructs the Redis cache key for a user.
 *
 * Example:
 * ```ts
 * const key = buildRedisCacheKeyUser("12345");
 * console.log(key); // "USER:12345"
 * ```
 *
 * @param {Snowflake | bigint} userId - The ID of the user.
 * @returns {string} The Redis cache key for the user.
 */
export const buildRedisCacheKeyUser = (
  userId: Snowflake | bigint,
): string => {
  return `${REDIS_CACHE_USER}${userId.toString()}`;
};
