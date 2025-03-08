// import { IKafkaEvent } from "../kafka/kafka.event";
import { OnModuleInit, OnModuleDestroy } from "@nestjs/common"; 
import { Kafka } from "kafkajs"; 

/**
 * Interface for a Kafka producer.
 * Declares methods for connecting, disconnecting, and sending messages to Kafka topics.
 */
export interface IKafkaProducer extends OnModuleInit, OnModuleDestroy {

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
   * Sends a message to a Kafka topic.
   * @async
   * @param {string} topic - The Kafka event topic to send the message to.
   * @param {any} message - The message to send to the Kafka topic.
   * @returns {Promise<any>} - Promise resolved once the message is sent.
   */
  send(topic: string, message: any): Promise<any>;

  /**
   * Gets the Kafka producer instance.
   * @returns {Producer} - The Kafka producer instance used to send messages.
   */
  getProducer(): any;
}



/**
 * Abstract class representing a Kafka producer that sends messages to Kafka topics.
 * Implements IKafkaProducer`.
 * 
 * @abstract
 */
export abstract class AbstractKafkaProducer implements IKafkaProducer {
  /**
   * Kafka producer instance used to send messages.
   * 
   * @protected
   * @type {Producer}
   */
  protected producer;

  /**
   * Instantiates a Kafka producer.
   * 
   * @param {Kafka} kafka - The Kafka client instance.
   */
  constructor(kafka: Kafka) {
      this.producer = kafka.producer();
  }
  
  getProducer() {
      return this.producer;
  }

  async onModuleInit() {
      await this.connect();
  }

  async onModuleDestroy() {
      await this.disconnect();
  }
  /**
   * Sends a message to a Kafka topic.
   * 
   * @async
   * @param {string} topic - The Kafka event topic to send the message to.
   * @param {any} message - The message to send to the Kafka topic.
   * @returns {Promise<any>} - Promise resolved once the message is sent.
   */
  async send(topic: string, message: any): Promise<any> {
      await this.producer.send({
          topic: topic,
          messages: [{ value: JSON.stringify(message) }],
      });
  }
  async connect() {
      await this.producer.connect();
  }

  async disconnect() {
      await this.producer.disconnect();
  }
}