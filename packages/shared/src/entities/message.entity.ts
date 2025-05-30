
import { ISnowflakeGenerator } from "@tellme/common";
import { SnowflakeEntity } from "./abstract.entity";

/**
 * Represents a message entity with a unique identifier, channel ID, sender ID, and message content.
 * This class extends from SnowflakeEntity and provides methods for message creation.
 */
export class MessageEntity extends SnowflakeEntity {
  /** The ID of the channel where the message is posted. */
  channelId: string;

  /** The ID of the sender of the message. */
  senderId: string;

  /** The content of the message. */
  content: string;

  /**
   * Creates an instance of MessageEntity with provided attributes.
   * @param id The unique identifier for the message (Snowflake ID).
   * @param channelId The ID of the channel where the message is posted.
   * @param senderId The ID of the sender of the message.
   * @param content The content of the message.
   * @param createdAt The creation timestamp of the message. If not provided, the current date will be used.
   * @param upatedAt The update timestamp of the message. If not provided, the current date will be used.
   */
  constructor(id: string, channelId: string, senderId: string, content: string, createdAt?: Date, upatedAt?: Date) {
    super(id, createdAt, upatedAt);
    this.channelId = channelId;
    this.senderId =  senderId;
    this.content = content;
  }

  /**
   * Creates a new MessageEntity with a generated Snowflake ID.
   * @param snowflakeGenerator The generator responsible for creating the Snowflake ID.
   * @param channelId The ID of the channel where the message will be posted.
   * @param senderId The ID of the sender of the message.
   * @param content The content of the message.
   * @returns A new instance of MessageEntity with a generated Snowflake ID.
   */
  static new(snowflakeGenerator: ISnowflakeGenerator, channelId: string, senderId: string, content: string) {
    const newMessage = new MessageEntity(
      snowflakeGenerator.generate(), // Generate a new Snowflake ID
      channelId,
      senderId,
      content
    );
    return newMessage;
  }

  static edit(messageId: string, channelId: string, content: string) {
    const newMessage = new MessageEntity(
      messageId, 
      channelId,
      "0", // Sender ID is not updated
      content,
    );
    return newMessage;
  }
}
