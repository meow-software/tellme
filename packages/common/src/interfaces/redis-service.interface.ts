import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";

export const REDIS_SERVICE = Symbol('REDIS_SERVICE');
export const REDIS_PUBSUB_SERVICE = Symbol('REDIS_PUBSUB_SERVICE');
export const REDIS_AUTH_SERVICE = Symbol('REDIS_AUTH_SERVICE');

/**
 * Base interface for Redis integration in NestJS.
 *
 * Extends NestJS lifecycle hooks (`OnModuleInit`, `OnModuleDestroy`)
 * and provides access to a Redis client along with basic operations.
 */
export interface IRedisService extends OnModuleInit, OnModuleDestroy {
  readonly redis: Redis;
  setJSON(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  getJSON<T = any>(key: string): Promise<T | null>;
  del(key: string): Promise<void>;
  setNX(key: string, value: string, ttlSeconds: number): Promise<void>;
}

/**
 * Extended interface for Redis Pub/Sub integration.
 *
 * Adds publishing and subscription capabilities on top of the
 * base `IRedisService`, enabling event-driven communication.
 */
export interface IRedisPubSubService extends IRedisService {
  getSubscriber(): Redis;
  publish(channel: string, message: string): Promise<void>;
  onMessage(callback: (channel: string, message: string) => void): void;
}

/**
 * Specialized interface for authentication-related Redis operations.
 *
 * Extends `IRedisPubSubService` with features specific to
 * session and token management, such as replacing bot sessions
 * via Lua scripts.
 */
export interface IRedisAuthService extends IRedisPubSubService {
  get SCRIPT_REDIS_REPLACE_BOT_SESSION();
  replaceBotSession(clientType: string, id: string, jti: string, ttl: number);
}
