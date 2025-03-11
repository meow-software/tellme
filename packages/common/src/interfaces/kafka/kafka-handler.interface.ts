import 'reflect-metadata';
import { IKafkaConsumer } from '@tellme/common';
import { Reflector } from '@nestjs/core';

/**
 * Interface for Kafka event handlers. A handler processes messages of a specific event type.
 * 
 * @interface
 */
export interface IKafkaEventHandler {
  /**
   * The event type (topic) that this handler processes.
   * 
   * @type {string}
   */
  // eventType: string;

  /**
   * Handles the event message for a specific Kafka event.
   * 
   * @param {any} message - The message to handle.
   * @returns {void} - No return value, the handler processes the event.
   */
  // handleEvent(message: any): void;
}

/**
 * Decorator to mark a method as a Kafka event handler.
 * Associates a Kafka event type with a class method using metadata.
 * 
 * @param eventType - The Kafka event type this method should handle.
 * @returns A method decorator.
 */
export function OnKafkaEventHandler(eventType: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    // Store the eventType metadata on the method
    // console.log("---Kafka decoration", eventType, "---", target.constructor.name, "---prototype key", propertyKey);
    Reflect.defineMetadata('kafka:eventType', eventType, target.constructor.prototype, propertyKey);
  };
}

/**
 * Registers event handlers for a Kafka consumer by scanning the provided handler class for decorated methods.
 * 
 * @param kafkaEventHandler - The instance of the event handler class containing methods decorated with `@OnKafkaEventHandler`
 * @param consumer - The Kafka consumer that will map event types to the corresponding handler functions
 */
export function registerEventHandlers(
  kafkaEventHandler: IKafkaEventHandler,
  consumer: IKafkaConsumer
) {
  // Get the prototype of the handler class to inspect its methods
  const prototype = Object.getPrototypeOf(kafkaEventHandler);

  // Iterate over all method names defined in the prototype
  Object.getOwnPropertyNames(prototype).forEach((methodName) => {
    // Retrieve the Kafka event type metadata attached to the method
    const eventType = Reflect.getMetadata('kafka:eventType', prototype, methodName);

    // If an event type is found, register the method as an event handler
    if (eventType) {
      // console.log(`Kafka Event Registered: ${eventType} -> ${methodName}`);

      // Bind the method to the instance of the handler class and store it in the consumer's event map
      consumer.setMapEventHandlers(
        eventType,
        kafkaEventHandler[methodName].bind(kafkaEventHandler)
      );
    }
  });
}
