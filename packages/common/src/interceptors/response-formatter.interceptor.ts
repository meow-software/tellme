import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { RESPONSE_FORMATTER_FIELDS } from '../decorators';
import { ResponseFormatterService } from '../services';

/**
 * Interceptor that formats outgoing responses by removing sensitive or unwanted fields.
 *
 * Uses {@link ResponseFormatterService} to process the data, and optionally
 * retrieves a list of fields to remove from the `@RESPONSE_FORMATTER_FIELDS` decorator.
 *
 * Default fields removed: `['password', 'secret', 'token']`.
 */
@Injectable()
export class ResponseFormatterInterceptor implements NestInterceptor {
  /**
   * @param formatter - Service responsible for formatting response data
   * @param reflector - NestJS reflector to read metadata from decorators
   */
  constructor(
    private readonly formatter: ResponseFormatterService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Intercepts outgoing responses and formats them.
   *
   * @param context - Current execution context (provides access to request/response)
   * @param next - Next handler in the request pipeline
   * @returns An Observable emitting the formatted response
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Retrieve the list of fields to remove from the decorator metadata
    const removeKeys: string[] = this.reflector.get<string[]>(
      RESPONSE_FORMATTER_FIELDS,
      context.getHandler(),
    ) ?? ['password', 'secret', 'token']; // default sensitive fields

    return next.handle().pipe(
      // Apply the formatter to remove sensitive fields before sending the response
      map(data => this.formatter.format(data, removeKeys))
    );
  }
}
