import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

/**
 * Interface for WebSocket handlers.
 * Defines the structure for handling WebSocket events and emitting data.
 */
export interface IBaseWebsocketHandler {
  /**
   * Event for resource creation.
   */
  getCreateEvent(): string;

  /**
   * Event for resource updates.
   */
  getUpdateEvent(): string;

  /**
   * Event for resource deletion.
   */
  getDeleteEvent(): string;

  /**
   * WebSocket server instance.
   */
  getServer(): Server;

  /**
   * Registers WebSocket event handlers.
   * Automatically maps events to their corresponding methods.
   * 
   * @param server - The WebSocket server instance.
   */
  registerHandlers(server: Server): void;

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

  /**
   * Emits an event to a specific client.
   * 
   * @param client - The target client socket.
   * @param event - The event name to emit.
   * @param payload - The data to send with the event.
   */
  emitToClient(client: Socket, event: string, payload: any): void;

  /**
   * Handles resource creation.
   * Must be implemented by child classes.
   * 
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to create the resource.
   */
  create(server: Server, client: Socket, payload: any): void;

  /**
   * Handles resource updates.
   * Must be implemented by child classes.
   * 
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to update the resource.
   */
  update(server: Server, client: Socket, payload: any): void;

  /**
   * Handles resource deletion.
   * Must be implemented by child classes.
   * 
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to delete the resource.
   */
  delete(server: Server, client: Socket, payload: any): void;
}

/**
 * Abstract base class for WebSocket handlers.
 * Provides common functionality and enforces a consistent structure for all handlers.
 */
export abstract class BaseWebsocketHandler implements IBaseWebsocketHandler{
  /**
   * Event for resource creation.
   */
  protected createEvent!: string;

  /**
   * Event for resource updates.
   */
  protected updateEvent!: string;

  /**
   * Event for resource deletion.
   */
  protected deleteEvent!: string;

  protected server!: Server;

  getCreateEvent(): string {
    return this.createEvent;
  }

  getUpdateEvent(): string {
    return this.updateEvent;
  }

  getDeleteEvent(): string {
    return this.deleteEvent;
  }

  getServer(): Server {
    return this.server;
  }

  /**
   * Registers WebSocket event handlers.
   * This implementation automatically maps events to their corresponding methods.
   * @param server - The WebSocket server instance.
   */
  registerHandlers(server: Server): void {
    this.server = server;
    server.on('connection', (client: Socket) => {
      // Automatically register event listeners based on the defined events
      if (this.createEvent) {
        client.on(this.createEvent , (payload: any) => this.create(server, client, payload));
      }

      if (this.updateEvent) {
        client.on(this.updateEvent , (payload: any) => this.update(server, client, payload));
      }

      if (this.deleteEvent) {
        client.on(this.deleteEvent , (payload: any) => this.delete(server, client, payload));
      }

    });
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

  /**
   * Abstract method for handling resource creation.
   * Must be implemented by child classes.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to create the resource.
   */
  abstract create(server: Server, client: Socket, payload: any): void;

  /**
   * Abstract method for handling resource updates.
   * Must be implemented by child classes.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to update the resource.
   */
  abstract update(server: Server, client: Socket, payload: any): void;

  /**
   * Abstract method for handling resource deletion.
   * Must be implemented by child classes.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to delete the resource.
   */
  abstract delete(server: Server, client: Socket, payload: any): void;
}