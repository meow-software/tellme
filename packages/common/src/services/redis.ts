import Redis from 'ioredis';
import { IEventBus, IRedisService } from '../interfaces/';

/**
 * Abstract base class for Redis integration in NestJS modules.
 *
 * This class provides:
 * - Lifecycle management for Redis connections (`onModuleInit`, `onModuleDestroy`).
 * - Utility methods for working with JSON values in Redis.
 * - Basic operations like `set`, `get`, `del`, and `setNX`.
 *
 * Intended to be extended by more specialized Redis services.
 */
export abstract class AbstractRedis implements IRedisService {

  /**
   * @param client - The main Redis client instance used for commands.
   */
  constructor(protected client: Redis) {}

  /**
   * Lifecycle hook executed when the module is initialized.
   * Subclasses may override if they need initialization logic.
   */
  async onModuleInit() {
    // console.log("Redis init");
  }

  /**
   * Lifecycle hook executed when the module is destroyed.
   * Ensures the Redis connection is properly closed.
   */
  async onModuleDestroy() {
    await this.client.quit();
  }

  /**
   * Provides direct access to the underlying Redis client instance.
   *
   * @returns The Redis client.
   */
  get redis(): Redis {
    return this.client;
  }

  /**
   * Stores a JSON-serializable value in Redis under the given key.
   * Optionally applies a TTL (time-to-live).
   *
   * @param key - Redis key.
   * @param value - Value to store (will be JSON.stringified).
   * @param ttlSeconds - Optional TTL in seconds (if > 0, sets expiration).
   */
  async setJSON(key: string, value: unknown, ttlSeconds?: number) {
    const payload = JSON.stringify(value);
    if (ttlSeconds && ttlSeconds > 0) {
      await this.client.set(key, payload, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, payload);
    }
  }

  /**
   * Retrieves and parses a JSON value from Redis.
   *
   * @param key - Redis key.
   * @returns The parsed value, or null if the key does not exist.
   */
  async getJSON<T = any>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  /**
   * Deletes a key from Redis.
   *
   * @param key - Redis key to delete.
   */
  async del(key: string) {
    await this.client.del(key);
  }

  /**
   * Sets a value in Redis only if the key does not already exist (NX option).
   * Automatically applies an expiration time (EX).
   *
   * Useful for locks or ensuring one-time initialization.
   *
   * @param key - Redis key.
   * @param value - Value to store.
   * @param ttlSeconds - Time-to-live in seconds.
   */
  async setNX(key: string, value: string, ttlSeconds: number) {
    await this.client.set(key, value, 'EX', ttlSeconds, 'NX');
  }
}


/**
 * Extended abstract class for Redis Pub/Sub functionality.
 *
 * In addition to the base `AbstractRedis` features, this class provides:
 * - A dedicated subscriber client.
 * - Methods to publish messages and register message listeners.
 *
 * Useful for real-time messaging and event-driven communication.
 */
export abstract class AbstractRedisPubSub extends AbstractRedis {
  /**
   * A dedicated Redis client used only for subscribing to channels.
   */
  protected subscriber: Redis;

  constructor(client: Redis) {
    super(client);
    // Initialize a separate Redis instance for subscriptions.
    this.subscriber = new Redis(client.options);
  }

  /**
   * Lifecycle hook executed when the module is destroyed.
   * Ensures both the main client and the subscriber connection are closed.
   */
  async onModuleDestroy() {
    super.onModuleDestroy();
    await this.subscriber.quit();
  }

  /**
   * Returns the Redis client dedicated to subscriptions.
   *
   * @returns Redis client for subscribing to channels.
   */
  getSubscriber(): Redis {
    return this.subscriber;
  }

  /**
   * Publishes a message to a Redis channel.
   *
   * @param channel - Name of the Redis channel.
   * @param message - Message payload as a string.
   */
  async publish(channel: string, message: string) {
    await this.client.publish(channel, message);
  }

  /**
   * Registers a callback for messages received on subscribed channels.
   *
   * @param callback - Function called with (channel, message) when a message is received.
   */
  onMessage(callback: (channel: string, message: string) => void) {
    this.subscriber.on('message', callback);
  }
}


/**
 * Specialized abstract class for authentication-related Redis operations.
 *
 * Extends `AbstractRedisPubSub` to leverage both Pub/Sub and
 * core Redis features. Provides support for executing Lua scripts
 * related to authentication, such as replacing bot sessions.
 */
export abstract class AbstractRedisAuth extends AbstractRedisPubSub {
  /**
   * Reference to a pre-loaded Lua script SHA used for replacing bot sessions.
   */
  protected SCRIPT_REDIS_REPLACE_BOT_SESSION;

  constructor(client: Redis) {
    super(client);
  }

  /**
   * Replaces a bot session in Redis using a Lua script.
   *
   * @param clientType - The type of client (e.g., "web", "mobile").
   * @param id - The bot or user ID.
   * @param jti - The JWT ID (used for token validation/revocation).
   * @param ttl - Time-to-live in seconds for the session.
   *
   * @returns The result of the Lua script execution.
   */
  async replaceBotSession(clientType: string, id: string, jti: string, ttl: number) {
    return await this.redis.evalsha(
      this.SCRIPT_REDIS_REPLACE_BOT_SESSION,
      0,
      clientType,
      id,
      jti,
      ttl.toString()
    );
  }
}


export abstract class RedisEventBus extends AbstractRedisPubSub implements IEventBus {
  /**
   * Publishes an event to a given channel.
   * The message is automatically serialized to JSON before publishing.
   * 
   * @param channel - The name of the channel or topic
   * @param message - The payload of the event
   */
  async publish(channel: string, message: any) {
    await super.publish(channel, JSON.stringify(message));
  }

  /**
   * Subscribes to a specific channel.
   * Incoming messages are automatically deserialized from JSON before
   * being passed to the callback.
   * 
   * @param channel - The name of the channel or topic
   * @param callback - Function invoked for each received message
   */
  subscribe(channel: string, callback: (message: any) => void) {
    super.onMessage((ch, msg) => {
      if (ch === channel) callback(JSON.parse(msg));
    });
  }
}
