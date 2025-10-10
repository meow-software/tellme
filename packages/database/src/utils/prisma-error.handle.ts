import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ServerCode } from './../lib/common';

/**
 * Utility function to handle Prisma errors globally.
 *
 * Converts Prisma-specific error codes into standardized NestJS exceptions.
 * This allows repositories and services to throw consistent, meaningful errors
 * without repeating the same try/catch logic everywhere.
 *
 * @param error - The caught error from a Prisma operation.
 * @throws NestJS HTTP exception matching the Prisma error code.
 */
export function handlePrismaError(error: unknown): never {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2000':
      case 'P2010':
      case 'P2033':
        throw new BadRequestException({
          code: ServerCode.UNKNOW,
          message: 'Invalid value for database column.',
          meta: error.meta,
        });
      // Unique constraint failed
      case 'P2002':
        throw new ConflictException({
          code: ServerCode.UNKNOW,
          message: 'A record with the same unique value already exists.',
          meta: error.meta,
        });
      case 'P2003':
      case 'P2014':
      case 'P2015':
        throw new BadRequestException({
          code: ServerCode.UNKNOW,
          message: 'Invalid relation reference or constraint violation.',
          meta: error.meta,
        });

      case 'P2011':
        throw new BadRequestException({
          code: ServerCode.UNKNOW,
          message: 'A required field cannot be null.',
          meta: error.meta,
        });

      // Record not found
      case 'P2025':
        throw new NotFoundException({
          code: ServerCode.UNKNOW,
          message: 'The requested record was not found.',
          meta: error.meta,
        });
      // Generic Prisma error fallback
      default:
        throw new InternalServerErrorException({
          code: ServerCode.UNKNOW,
          message: `Unexpected database error (code ${error.code}).`,
          detail: error.message,
        });
    }
  }

  // If not a Prisma error, rethrow the original error
  throw error;
}
