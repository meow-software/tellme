import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard - Custom JWT Authentication Guard
 * 
 * Extends the default AuthGuard('jwt') to support both Bearer tokens and cookies.
 * If an 'access_token' cookie is present, it will be used to set the Authorization header.
 * 
 * Key features:
 * - Supports JWT tokens from Authorization header (standard Bearer tokens)
 * - Supports JWT tokens from 'access_token' cookie (web browser compatibility)
 * - Cookie token takes precedence over existing Authorization header if present
 * - Provides custom error handling for authentication failures
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    /**
     * Extracts and enhances the HTTP request from the execution context.
     * This method ensures that the access token from cookies is properly included
     * in the Authorization header, handling both existing authorization headers
     * and cases where no bearer token is present.
     * 
     * @param context - The NestJS execution context containing HTTP request information
     * @returns The enhanced HTTP request with properly formatted Authorization header
     * 
     * @example
     * // Returns request with Authorization header containing token from cookies
     * const request = getRequest(context);
     */
    getRequest(context: ExecutionContext) {
        // Extract the HTTP request from the execution context
        const req = context.switchToHttp().getRequest();

        // Check if the request has cookies with an access token
        if (req.cookies && req.cookies['access_token']) {
            const token = req.cookies['access_token'];
            const authHeader = req.headers.authorization || '';

            const parts: string[] = [];
            let hasBearer = false;

            // Process existing authorization header parts
            for (const rawPart of authHeader.split(',')) {
                const part = rawPart.trim();
                if (!part) continue;

                // If a Bearer token is found in the existing header, replace it with the cookie token
                if (/^Bearer\s+/i.test(part)) {
                    parts.push(`Bearer ${token}`);
                    hasBearer = true;
                } else {
                    // Keep non-Bearer authorization parts unchanged
                    parts.push(part);
                }
            }

            // If no Bearer token was found in the existing header, add one with the cookie token
            if (!hasBearer) {
                parts.push(`Bearer ${token}`);
            }

            // Update the request's authorization header with the processed parts
            req.headers.authorization = parts.join(', ');
        }

        return req;
    }

    /**
     * Handles the result of JWT authentication
     * 
     * This method:
     * - Checks for authentication errors or missing user
     * - Throws UnauthorizedException if authentication fails
     * - Returns the user object if authentication succeeds
     * 
     * @param err - Error object from JWT validation
     * @param user - User object extracted from JWT payload
     * @param info - Additional info about JWT validation
     * @param context - Execution context (optional)
     * @param status - Status information (optional)
     * @returns Authenticated user object
     * @throws UnauthorizedException when authentication fails
     */
    handleRequest(err: any, user: any, info: any, context: any, status: any) {
        // If there's an error or no user was extracted from JWT
        if (err || !user) {
            throw new UnauthorizedException('Invalid or expired token.');
        }

        // Return the authenticated user (will be available as req.user)
        return user;
    }

    /**
     * Activates the JWT authentication process
     * 
     * This method:
     * - Delegates to the parent canActivate method
     * - Triggers the JWT validation process through Passport strategy
     * 
     * @param context - ExecutionContext for the current request
     * @returns Promise<boolean> indicating if access is granted
     */
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }
}