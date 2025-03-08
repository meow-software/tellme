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
  eventType: string;

  /**
   * Handles the event message for a specific Kafka event.
   * 
   * @param {any} message - The message to handle.
   * @returns {void} - No return value, the handler processes the event.
   */
  handleEvent(message: any): void;
}
