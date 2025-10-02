export const EVENT_BUS = Symbol('EVENT_BUS');

export interface IMessageBus{
  type: string;
  data: any;
}

export interface IEventBus {
  /**
   * Publishes an event on a given channel/topic
   * @param channel - The name of the channel or topic
   * @param message - The event payload
   */
  publish(channel: string, message: IMessageBus): Promise<void>;

  /**
   * Subscribes to a channel/topic
   * @param channel - The name of the channel or topic
   * @param callback - Function called for each received message
   */
  subscribe(channel: string, callback: (message: IMessageBus) => void): void;
}
