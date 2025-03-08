export class RedisCacheKey {
    protected static readonly REDIS_CACHE_USER_TOKEN = `USER:TOKENS:`;
    protected static readonly REDIS_CACHE_USER_CONNECTED = `user:connected:`;
    protected static readonly REDIS_CACHE_SOCKET_CONNECTED = `socket:connected:`;
  
    static getUserToken(userId: string | number): string {
      return `${this.REDIS_CACHE_USER_TOKEN}${userId}`;
    }
  
    static getUserConnected(userId: string | number): string {
      return `${this.REDIS_CACHE_USER_CONNECTED}${userId}`;
    }
  
    static getSocketConnected(socketId: string): string {
      return `${this.REDIS_CACHE_SOCKET_CONNECTED}${socketId}`;
    }
  }
  