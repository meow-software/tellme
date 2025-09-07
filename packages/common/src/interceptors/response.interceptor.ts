import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseUtil } from '../utils';

/**
 * Interceptor that standardizes HTTP responses.
 *
 * It transforms successful responses into a consistent format
 * using {@link ResponseUtil.catch}, wrapping payloads and messages.
 *
 * Example output format:
 * ```json
 * {
 *   "data": {...},
 *   "message": "OK",
 *   "path": "/api/example"
 * }
 * ```
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  /**
   * Intercepts the request/response lifecycle.
   *
   * @param context - Current execution context (provides access to request/response)
   * @param next - Next handler in the request pipeline
   * @returns An Observable that emits the transformed response
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse(); // Express/HTTP response object
    const req = ctx.getRequest();  // Express/HTTP request object

    return next.handle().pipe(
      /**
       * Maps the original handler result into a standardized response format.
       * Ensures every successful response has `data` and `message`.
       */
      map((data) =>
        ResponseUtil.catch<any>(
          {
            data: data?.payload ?? data ?? {},
            message:
              // data?.message ||
              'OK',
          },
          req.originalUrl,
          res.statusCode,
        ),
      ),
    );
  }
}
