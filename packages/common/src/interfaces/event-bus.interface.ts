export const EVENT_BUS = Symbol('EVENT_BUS');

export interface IEventBus {
  publish(topic: string, message: any): Promise<void>;
  subscribe?(topic: string, handler: (message: any) => Promise<void> | void): Promise<void>;
  close?(): Promise<void>;
}
