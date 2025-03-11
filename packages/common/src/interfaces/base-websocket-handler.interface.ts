import { Server, Socket } from 'socket.io';
import { IWebsocketGateway } from '@tellme/common';

/**
 * Interface for WebSocket handlers.
 * Defines the structure for handling WebSocket events and emitting data.
 */
export interface IBaseWebsocketHandler {
  /**
   * Gets the WebSocket server instance.
   * 
   * @returns {Server} - The WebSocket server instance.
   */
  getServer(): Server;

  /**
   * Sets the WebSocket server instance.
   * 
   * @param {Server} server - The WebSocket server instance to set.
   */
  setServer(server: Server): void;

  /**
   * Emits an event to all connected clients.
   * 
   * @param event - The event name to emit.
   * @param payload - The data to send with the event.
   */
  emitToAll(event: string, payload: any): void;

  /**
   * Emits an event to all clients in a specific WebSocket room.
   * 
   * @param room - The name of the room to which the event should be sent.
   * @param event - The event name to emit.
   * @param payload - The data to send with the event.
   */
  emitToRoom(room: string, event: string, payload: any): void;

}

/**
 * Abstract base class for WebSocket handlers.
 * Provides common functionality and enforces a consistent structure for all websoket handlers.
 */
export abstract class BaseWebsocketHandler implements IBaseWebsocketHandler {
  protected server!: Server;

  /**
   * Gets the WebSocket server instance.
   * 
   * @returns {Server} - The WebSocket server instance.
   */
  getServer(): Server {
    return this.server;
  }

  /**
   * Sets the WebSocket server instance.
   * 
   * @param {Server} server - The WebSocket server instance to set.
   */
  setServer(server: Server): void {
    this.server = server;
  }


  /**
   * Emits an event to all connected clients.
   * @param event - The event name to emit.
   * @param payload - The data to send with the event.
   */
  public emitToAll(event: string, payload: any): void {
    this.server.emit(event, payload);
  }
  /**
   * Emits an event to all clients in a specific WebSocket room.
   * If the room does not exist or has no connected clients, the event will not be sent to anyone.
   * 
   * @param room - The name of the room to which the event should be sent.
   * @param event - The event name to emit.
   * @param payload - The data to send with the event.
   */
  public emitToRoom(room: string, event: string, payload: any): void {
    this.server.to(room).emit(event, payload);
  }

  /**
   * Emits an event to a specific client.
   * @param client - The target client socket.
   * @param event - The event name to emit.
   * @param payload - The data to send with the event.
   */
  public emitToClient(client: Socket, event: string, payload: any): void {
    client.emit(event, payload);
  }

}

/**
 * Decorator to register a WebSocket event handler.
 * 
 * This decorator attaches metadata to a method, linking it to a WebSocket event type.
 * The metadata can later be used to dynamically register the event handler.
 * 
 * @param {string} eventType - The WebSocket event name that the method should handle.
 * @returns {MethodDecorator} - A method decorator that stores the event type.
 */
export function OnWebsocketEventHandler(eventType: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    // Store event type metadata on the method for later retrieval
    Reflect.defineMetadata('websocket:eventType', eventType, target.constructor.prototype, propertyKey);
  };
}


/**
 * Registers WebSocket event handlers from a given handler class.
 * 
 * This function scans the methods of a WebSocket handler class and registers them 
 * in the gateway's event handler map based on their associated event types.
 * 
 * @param {IBaseWebsocketHandler} websocketHandler - The class instance containing WebSocket event handlers.
 * @param {IWebsocketGateway} gateway - The WebSocket gateway instance managing event handlers.
 */
export function registerWebsocketEventHandlers(
  websocketHandler: IBaseWebsocketHandler,
  gateway: IWebsocketGateway
) {
  // Retrieve the prototype of the class to inspect its methods
  const prototype = Object.getPrototypeOf(websocketHandler);

  // Iterate through all method names in the prototype
  Object.getOwnPropertyNames(prototype).forEach((methodName) => {
    // Retrieve the associated event type from metadata
    const eventType = Reflect.getMetadata('websocket:eventType', prototype, methodName);

    if (eventType) {
      const handler = websocketHandler[methodName];

      if (typeof handler === 'function') {
        // Bind the function once to optimize performance
        const boundHandler = handler.bind(websocketHandler);
        // Register the event type -> function mapping in the gateway
        gateway.setMapEventHandlers(eventType, boundHandler);
        // console.log(`WebSocket event registered: ${eventType} -> ${methodName}`);
      } else {
        console.warn(`Method ${methodName} is not a function.`);
      }
    }
  });
}


/**
 * Subscribes WebSocket event handlers to the server.
 * 
 * This function retrieves all registered event handlers from the WebSocket gateway 
 * and binds them to the corresponding WebSocket events. The "connection" event is 
 * handled separately to ensure it is executed only once per client connection.
 * 
 * @param {IWebsocketGateway} gateway - The WebSocket gateway instance managing the event handlers.
 */
export function subscribeSocketEvents(gateway: IWebsocketGateway) {
  const eventMap = gateway.getMapEventHandlers();
  const server = gateway.getServer();

  // Retrieve the "connection" event handler if it exists in the event map
  const connectionHandler = eventMap.get("connection");

  // Listen for new client connections
  server.on('connection', (client: Socket) => {
    // console.log("New WebSocket client connected");

    // Execute the "connection" event handler if it was registered
    if (connectionHandler) {
      connectionHandler(server, client);
    }

    // Register other WebSocket event handlers for this client
    eventMap.forEach((handler, eventType) => {
      if (eventType !== "connection") { // Prevent overriding the "connection" event
        // console.log(`Registering WebSocket event: ${eventType}`);
        client.on(eventType, (payload: any) => {
          handler(server, client, payload);
        });
      }
    });
  });
}
