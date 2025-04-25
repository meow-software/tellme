import { Injectable } from '@nestjs/common';
import { RedisClientService } from '@tellme/common';
import { RedisCacheKey, RedisCacheTTL } from './../../utils/';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthCacheService extends RedisClientService {

    constructor(protected readonly configService: ConfigService) {
        super(configService);
    }

    /**
     * Stores a user token in Redis cache with expiration.
     *
     * @param {string } userId - The user's ID.
     * @param {string} token - The token to store.
     * @returns {Promise<void>} Resolves when the token is stored.
     */
    async storeToken(userId: string , token: string): Promise<void> {
        try {
            const redis = await this.getIoRedis();
            const key = RedisCacheKey.getUserToken(userId);

            await redis.sadd(key, token);
            await redis.expire(key, RedisCacheTTL.CACHE_TTL_JWT);
        } catch (error) {
            console.error('Error setting token in cache:', error);
            throw new Error('Failed to set token in cache');
        }
    }


    /**
     * Updates a user's token in Redis by replacing the old token with a new one.
     *
     * @param {string } userId - The user's ID.
     * @param {string} oldToken - The old token to be removed.
     * @param {string} newToken - The new token to store.
     * @returns {Promise<void>} Resolves when the token is updated.
     */
    async updateToken(userId: string , oldToken: string, newToken: string): Promise<void> {
        try {
            const redis = await this.getIoRedis();
            const key = RedisCacheKey.getUserToken(userId);

            await redis.srem(key, oldToken); // Remove old token
            await redis.sadd(key, newToken); // Add new token
            await redis.expire(key, RedisCacheTTL.CACHE_TTL_JWT); // Reset expiration
        } catch (error) {
            console.error('Error updating token in cache:', error);
            throw new Error('Failed to update token in cache');
        }
    }


    /**
     * Removes a user's token from Redis cache.
     *
     * @param {string } userId - The user's ID.
     * @param {string} token - The token to remove.
     * @returns {Promise<void>} Resolves when the token is removed.
     */
    async removeToken(userId: string , token: string): Promise<void> {
        try {
            const redis = await this.getIoRedis();
            const key = RedisCacheKey.getUserToken(userId);

            await redis.srem(key, token);
        } catch (error) {
            console.error('Error removing token from cache:', error);
            throw new Error('Failed to remove token from cache');
        }
    }

    /**
     * Removes all user's token from Redis cache.
     *
     * @param {string } userId - The user's ID.
     * @returns {Promise<void>} Resolves when the token is removed.
     */
    async removeAllToken(userId: string ): Promise<void> {
        try {
            const redis = await this.getIoRedis();
            const key = RedisCacheKey.getUserToken(userId);

            await redis.del(key);
        } catch (error) {
            console.error('Error removing token from cache:', error);
            throw new Error('Failed to remove token from cache');
        }
    }
}
