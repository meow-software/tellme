import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { KafkaMessage, EachMessagePayload, Kafka, Consumer } from 'kafkajs';
import { IKafkaEventHandler } from "./kafka-handler.interface";

/**
 * Interface for a Kafka consumer.
 * Declares the necessary methods for connecting, disconnecting, and handling Kafka messages.
 */
export interface IKafkaConsumer extends OnModuleInit, OnModuleDestroy {

  /**
   * Connects to the Kafka server.
   * @async
   * @returns {Promise<void>} - The promise resolved when the connection is established.
   */
  connect(): Promise<void>;

  /**
   * Disconnects from the Kafka server.
   * @async
   * @returns {Promise<void>} - The promise resolved when the disconnection is completed.
   */
  disconnect(): Promise<void>;

  /**
   * Subscribes to a Kafka event handler.
   * @param {IKafkaEventHandler} handler - The event handler instance to subscribe to.
   * @async
   * @returns {Promise<void>} - The promise resolved when the handler is successfully subscribed.
   */
  subscribeToHandler(handler: IKafkaEventHandler): Promise<void>;

  /**
   * Runs the Kafka consumer to start consuming messages.
   * @async
   * @returns {Promise<void>} - The promise resolved when the consumer starts running.
   */
  run(): Promise<void>;

  /**
   * Consumes a Kafka message and invokes the appropriate event handler.
   * @param {string} event - The Kafka event type (topic).
   * @param {KafkaMessage} message - The Kafka message to consume.
   * @param {EachMessagePayload} [eachMessage] - Additional metadata about the message.
   */
  consumeMessage(event: string, message: KafkaMessage, eachMessage?: EachMessagePayload): void;

  /**
   * Transforms a Kafka message into an object usable by the application.
   * @param {KafkaMessage} message - The Kafka message to transform.
   * @returns {any} - The transformed object containing the Kafka message's key, value, and headers.
   */
  fromKafkaMessageToObj(message: KafkaMessage): any;


  getConsumer(): Consumer;

  getClient(): Kafka;

  getHandlers(): IKafkaEventHandler[];
}



/**
 * Abstract class representing a Kafka consumer that connects to a Kafka server
 * and consumes Kafka event messages based on event handlers.
 * Implements `IKafkaConsumer`.
 * 
 * @abstract
 */
export abstract class AbstractKafkaConsumer implements IKafkaConsumer {
  protected consumer: Consumer;
  protected client: Kafka;
  protected handlers: IKafkaEventHandler[] = [];
  /**
     * Instantiates a Kafka consumer.
     * 
     * @param {Kafka} kafka - The Kafka client instance.
     * @param {string} groupId - The Kafka consumer group ID.
     */
  constructor(kafka: Kafka, groupId: string) {
    this.client = kafka;
    this.consumer = kafka.consumer({ groupId });
  }
  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }
  /**
     * Subscribes an event handler to a specific Kafka event type (topics).
     * 
     * @param {IKafkaEventHandler} handler - The event handler instance.
     * @async
     * @returns {Promise<void>} - Promise resolved once the handler is successfully subscribed.
     */
  async subscribeToHandler(handler: IKafkaEventHandler) {
    this.handlers.push(handler);
    await this.consumer.subscribe({ topic: handler.eventType as string });
  }
  /**
     * Runs the Kafka consumer to consume messages from subscribed topics.
     * 
     * @async
     * @returns {Promise<void>} - Promise resolved once the consumer is running.
     */
  async run() {
    await this.consumer.run({
      eachMessage: async (eachMessage) => {
        this.consumeMessage(eachMessage.topic, eachMessage.message, eachMessage);
      },
    });
  }
  /**
     * Consumes a Kafka message and calls the appropriate event handler.
     * 
     * @param {string} event - The Kafka event type (topic).
     * @param {KafkaMessage} message - The Kafka message to consume.
     * @param {EachMessagePayload} [eachMessage] - Additional metadata about the message.
     */
  public consumeMessage(event: string, message: KafkaMessage, eachMessage?: EachMessagePayload): void {
    const handler = this.handlers.find(h => h.eventType as string === event);

    if (handler) {
      handler.handleEvent(this.fromKafkaMessageToObj(message).value);
    }
  }

  /**
   * Transforms a Kafka message into an object usable by the application.
   * 
   * @protected
   * @param {KafkaMessage} message - The Kafka message to transform.
   * @returns {any} - The transformed object derived from the Kafka message; key, value, and headers.
   */
  public fromKafkaMessageToObj(message: KafkaMessage): any {
    const key = message.key?.toString();
    const value = message.value ? JSON.parse(message.value.toString()) : null;
    const headers = Object.fromEntries(
      Object.entries(message.headers || {}).map(([key, value]) => [key, value?.toString()])
    );
    return { key, value, headers };
  }

  async connect() {
    await this.consumer.connect();
  }

  async disconnect() {
    await this.consumer.disconnect();
  }

  public getConsumer(): Consumer {
    return this.consumer;
  }

  public getClient(): Kafka {
    return this.client;
  }

  public getHandlers(): IKafkaEventHandler[] {
    return this.handlers;
  }
}