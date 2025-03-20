export class RedisCacheKey {
  // Auth
  protected static readonly REDIS_CACHE_USER_TOKEN = `USER:TOKENS:`;
  protected static readonly REDIS_CACHE_USER_CONNECTED = `USER:CONNECTED:`;
  protected static readonly REDIS_CACHE_SOCKET_CONNECTED = `SOCKET:CONNECTED:`;
  /**
   * Constructs the Redis cache key for a user's token.
   * 
   * @param {BigInt | string} userId - The ID of the user.
   * @returns {string} - The Redis cache key for the user's token.
   */
  static getUserToken(userId: BigInt | string): string {
    return `${this.REDIS_CACHE_USER_TOKEN}${userId}`;
  }
  /**
   * Constructs the Redis cache key for checking if a user is connected.
   * 
   * @param {BigInt | string} userId - The ID of the user.
   * @returns {string} - The Redis cache key for the user's connection status.
   */
  static getUserConnected(userId: BigInt | string): string {
    return `${this.REDIS_CACHE_USER_CONNECTED}${userId}`;
  }

  /**
   * Constructs the Redis cache key for a specific socket connection.
   * 
   * @param {string} socketId - The ID of the socket connection.
   * @returns {string} - The Redis cache key for the socket connection.
   */
  static getSocketConnected(socketId: string): string {
    return `${this.REDIS_CACHE_SOCKET_CONNECTED}${socketId}`;
  }

  // Message 
  protected static readonly REDIS_CACHE_MESSAGE = `MESSAGE:`;
  /**
   * Constructs the Redis cache key for a specific message.
   * 
   * @param {BigInt | string} messageId - The ID of the message.
   * @returns {string} - The Redis cache key for the message.
   */
  static getMessage(messageId: BigInt | string ): string {
    return `${this.REDIS_CACHE_MESSAGE}${messageId}`;
  }

  // Guild 
  protected static readonly REDIS_CACHE_GUILD = `GUILD:`;
  // Channel
  protected static readonly REDIS_CACHE_CHANNEL = `CHANNEL:`;
  /**
   * Constructs the Redis cache key for a specific channel.
   * 
   * @param {BigInt | string} channelId - The ID of the channel.
   * @param {BigInt} [guildId] - The ID of the guild (server) the channel belongs to. If not provided, the channel is considered a direct message (DM) channel.
   * @returns {string} - The Redis cache key for the channel.
   * 
   * @description
   * When `guildId` is not provided, the method assumes the channel is a direct message (DM) channel and uses the format `guild::channel:${channelId}`.
   * When `guildId` is provided, the method refers to a channel within a specific guild (server) and uses the format `guild:${guildId}:channel:${channelId}`.
   */
  static getChannel(channelId: BigInt | string, guildId?: BigInt): string {
    if (!guildId) {
      guildId = BigInt(0);
    }
    return `${this.REDIS_CACHE_GUILD}${guildId}:${this.REDIS_CACHE_CHANNEL}${channelId}`;
  }

  /**
   * Constructs the Redis cache key pattern for all channels in a specific guild.
   * 
   * @param {BigInt} guildId - The ID of the guild (server) from which the channels are being queried.
   * @returns {string} - The Redis cache key pattern for all channels within the given guild.
   * 
   * @description
   * This key pattern is used to fetch all channels belonging to a specific guild. The format is `guild:${guildId}:channel:*`.
   */
  static getChannelsFromGuild(guildId: BigInt): string {
    return `${this.REDIS_CACHE_GUILD}${guildId}:${this.REDIS_CACHE_CHANNEL}*`;
  }
}
export class RedisCacheTTL {
  // Auth
  public static readonly CACHE_TTL_JWT = 60*60; // 1 hour
  // Message
  public static readonly CACHE_TTL_MESSAGE = 60 *60; // 1 hour
}