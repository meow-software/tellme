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
    * Saves a message in a channel
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
     * Updates an existing message in a channel.
     * If the message does not exist, an error is thrown.
     * If the message is missing from the channel list, it is re-added.
     * 
     * @param message The updated message entity.
     * @param guildId Optional guild ID for retrieving the correct channel key.
     */
    async updateMessage(message: MessageEntity, guildId?: string) {
        const messageKey = RedisCacheKey.getMessage(message.id);

        // Check if the message exists in Redis
        const exists = await this.redis.exists(messageKey);
        if (!exists) {
            // throw new Error(`Message with ID ${message.id} not found`);
            return;
        }
        const channelKey = RedisCacheKey.getChannel(message.channelId, guildId);
        // Update the message metadata in the HASH
        await this.redis.hmset(messageKey, { ...message });

        // Ensure the message is still in the channel's LIST
        const messages = await this.redis.lrange(channelKey, 0, -1);
        if (!messages.includes(message.id)) {
            // If the message is missing, re-add it to the list
            await this.redis.lpush(channelKey, message.id);
            // Keep the list limited to the last 100 messages
            await this.redis.ltrim(channelKey, 0, 99);
        }
    }

    /**
     * Deletes a message from a channel.
     * Removes the message metadata from Redis and ensures it is removed from the channel list.
     * 
     * @param messageEntity The deleted message.
     * @param guildId Optional guild ID for retrieving the correct channel key.
     */
    async deleteMessage(messageEntity: MessageEntity, guildId?: string) {
        const messageKey = RedisCacheKey.getMessage(messageEntity.id);
        const channelKey = RedisCacheKey.getChannel(messageEntity.channelId, guildId);

        // Remove the message metadata from Redis
        await this.redis.del(messageKey);

        // Remove the message ID from the channel's message list
        await this.redis.lrem(channelKey, 0, messageEntity.id);
    }


    /**
    * Retrieves messages from a channel
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
    * Gets all messages from a guild (all its channels)
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
                channelId = "0";// TODO, supprimer apres avoir testé le cas
            }
            const messages = await this.getMessages(channelId, guildId);
            allMessages[channelId] = messages;
        }

        return allMessages;
    }
}
