import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { KafkaMessage, EachMessagePayload, Kafka, Consumer } from 'kafkajs';
import { IKafkaEventHandler } from "./kafka-handler.interface";
import { registerEventHandlers } from '@tellme/common';

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
   * Registe to a Kafka event handler.
   * @param {IKafkaEventHandler} handler - The event handler instance to register.
   * @async
   * @returns {Promise<void>} - The promise resolved when the handler is successfully register.
   */
  registerEventHandlers(handler: IKafkaEventHandler): Promise<void>;

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
  
  setMapEventHandlers(eventType: string, handler: Function): void;
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
  protected mapEventHandlers = new Map<string, Function>();

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

  async setMapEventHandlers(eventType: string, handler: Function) {
    this.mapEventHandlers.set(eventType, handler);
    // console.log(`KafkaConsumer - Registered event: ${eventType} -> ${handler}`);
  }

  /**
     * Register an event handler to a specific Kafka event type (topics).
     * 
     * @param {IKafkaEventHandler} handler - The event handler instance.
     * @async
     * @returns {Promise<void>} - Promise resolved once the handler is successfully registered.
     */
  async registerEventHandlers(handler: IKafkaEventHandler) {
    this.handlers.push(handler);
    registerEventHandlers(handler, this);
  }
  /**
     * Subscribe topics and runs the Kafka consumer to consume messages from subscribed topics.
     * 
     * @async
     * @returns {Promise<void>} - Promise resolved once the consumer is running.
     */
  async run() {
    // Subscribe event kafka
    if (this.mapEventHandlers.size > 0) {
      const topics = Array.from(this.mapEventHandlers.keys());
      // console.log('-- Subscribing to topics:', topics);
      await this.consumer.subscribe({ topics, fromBeginning: true });
    }else{
      console.warn('No event handlers registered. Consumer will not subscribe to any topics.');
    }
    // Run the consumer
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
  async consumeMessage(event: string, message: KafkaMessage, eachMessage?: EachMessagePayload): Promise<void> {
    const handleEvent = this.mapEventHandlers.get(event);
    if (handleEvent) {
      await handleEvent(this.fromKafkaMessageToObj(message).value);
    } else {
      console.warn(`No handler found for Kafka event: ${handleEvent}`);
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