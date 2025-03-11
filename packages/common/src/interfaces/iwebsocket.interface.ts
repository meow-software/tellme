import { Server } from 'socket.io';
import { IBaseWebsocketHandler, subscribeSocketEvents, registerWebsocketEventHandlers } from '@tellme/common';

/**
 * Interface for a WebSocket gateway.
 */
export interface IWebsocketGateway {
    /**
     * Sets the WebSocket server instance.
     * @param {Server} server - The WebSocket server instance.
     */
    setServer(server: Server): void;
  
    /**
     * Registers an event handler for a specific WebSocket event.
     * @param {string} eventType - The WebSocket event name.
     * @param {Function} handler - The function to handle the event.
     */
    setMapEventHandlers(eventType: string, handler: Function): void;
  
    /**
     * Retrieves the map of registered WebSocket event handlers.
     * @returns {Map<string, Function>} - A map of event names to their handlers.
     */
    getMapEventHandlers(): Map<string, Function>;
  
    /**
     * Registers event handlers for a WebSocket handler instance.
     * @param {IBaseWebsocketHandler} handler - The WebSocket handler instance.
     */
    registerEventHandlers(handler: IBaseWebsocketHandler): void;
  
    /**
     * Retrieves the WebSocket server instance.
     * @returns {Server} - The WebSocket server instance.
     */
    getServer(): Server;
  
    /**
     * Retrieves all registered WebSocket handlers.
     * @returns {IBaseWebsocketHandler[]} - An array of WebSocket handlers.
     */
    getHandlers(): IBaseWebsocketHandler[];
  
    /**
     * Starts listening for WebSocket events.
     */
    listen(): void;
  }
  
  /**
   * Abstract class that implements the WebSocket gateway.
   */
  export abstract class EchoWebsocketGateway implements IWebsocketGateway {
    /** List of WebSocket event handlers. */
    protected handlers: IBaseWebsocketHandler[] = [];
  
    /** WebSocket server instance. */
    protected server!: Server;
  
    /** Map of WebSocket event names to their corresponding handlers. */
    protected mapEventHandlers = new Map<string, Function>();
  
    constructor() {}
  
    setServer(server: Server): void {
      this.server = server;
    }
  
    setMapEventHandlers(eventType: string, handler: Function): void {
      this.mapEventHandlers.set(eventType, handler);
    }
  
    getMapEventHandlers(): Map<string, Function> {
      return this.mapEventHandlers;
    }
  
    registerEventHandlers(handler: IBaseWebsocketHandler): void {
      this.handlers.push(handler);
      handler.setServer(this.server);
      registerWebsocketEventHandlers(handler, this);
    }
  
    getServer(): Server {
      return this.server;
    }
  
    getHandlers(): IBaseWebsocketHandler[] {
      return this.handlers;
    }
  
    listen(): void {
      subscribeSocketEvents(this);
    }
  }
  