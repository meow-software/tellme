import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse, ResponseUtil } from '..';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default to 500 if status cannot be determined
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Nest exceptions often contain a structured response
    let errorResponse = exception.getResponse();
    if (typeof errorResponse === 'string') {
      errorResponse = {error: errorResponse}
    }


    // Build standardized error response
    const apiResponse: ApiResponse<null> = ResponseUtil.catch(
      {
        errors: {...errorResponse, statusCode: status},
        message:
          // (errorResponse as any)?.message ||
          // exception.message ||
          'KO',
      },
      request.url,
      status,
    );

    response.status(status).json(apiResponse);
  }
}
