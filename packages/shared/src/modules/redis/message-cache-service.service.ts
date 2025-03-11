import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisClientService } from '@tellme/common';
import { MessageEntity, RedisCacheKey } from '@tellme/shared';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageCacheService extends RedisClientService {

    constructor(protected readonly configService: ConfigService) {
        super(configService);
        
    }

    /**
    * 📌 Saves a message in a channel
    * @param guildId Guild ID
    */
    async saveMessage(message: MessageEntity, guildId?: string) {
        const messageKey = RedisCacheKey.getMessage(message.id);
        const channelKey = RedisCacheKey.getChannel(message.channelId, guildId);

        // Enregistrement des métadonnées du message dans un HASH
        await this.redis.hmset(messageKey, {
            ...message
        });

        // Ajout du message dans la LIST du salon
        await this.redis.lpush(channelKey, message.id);

        // Limite à 100 messages (supprime les plus anciens)
        await this.redis.ltrim(channelKey, 0, 99);
    }

    /**
    * 📌 Retrieves messages from a channel
    * @param guildId Guild ID
    * @param channelId Channel ID
    * @param limit Number of messages to retrieve (default 10)
    */
    async getMessages(guildId: string, channelId: string, limit: number = 10) {
        const channelKey = RedisCacheKey.getChannel(channelId, guildId);

        // Récupérer les derniers `limit` messages
        const messageIds = await this.redis.lrange(channelKey, 0, limit - 1);

        // Récupérer les détails de chaque message
        const messages = await Promise.all(
            messageIds.map(async (messageId) => {
                return this.redis.hgetall(RedisCacheKey.getMessage(messageId));
            })
        );

        return messages;
    }

    /**
    * 📌 Gets all messages from a guild (all its channels)
    * @param guildId Guild ID
    */
    async getMessagesFromGuild(guildId: string) {
        const pattern = RedisCacheKey.getChannelsFromGuild(guildId);
        const keys = await this.redis.keys(pattern);

        let allMessages = {};
        for (const key of keys) {
            let channelId = key.split(':').pop(); // Récupérer l'ID du salon
            if (!channelId) {
                // is not supposed to happen, but to not generate an error
                // continue; // TODO, reactiver apres avoir testé le cas
                channelId = "";// TODO, supprimer apres avoir testé le cas
            }
            const messages = await this.getMessages(channelId, guildId);
            allMessages[channelId] = messages;
        }

        return allMessages;
    }
}
