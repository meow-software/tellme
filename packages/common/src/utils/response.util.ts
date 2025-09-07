import { ApiResponse } from "..";
import { HttpStatus } from '@nestjs/common';

/**
 * Utility class to build standardized API responses.
 * Ensures that both success and error responses follow the same format.
 */
export class ResponseUtil {
    /**
     * Builds a standardized API response (either success or error).
     * Automatically determines the type of response based on the presence of `errors`.
     *
     * @param input - Partial response object containing either `data` or `errors`.
     * @param path - The request path that triggered the response.
     * @param statusCode - The HTTP status code of the response.
     * @returns A standardized ApiResponse object.
     */
    static build<T = any>(
        input: Partial<ApiResponse<T>> & { data?: T; errors?: any },
        path: string,
        statusCode: HttpStatus,
    ): ApiResponse<T | null> {
        const isError = input.errors && Object.keys(input.errors).length > 0;

        return {
            success: !isError,
            data: isError ? null : input.data ?? null,
            message: isError ? 'KO' : 'OK',
            errors: isError ? input.errors : null,
            timestamp: new Date().toISOString(),
            statusCode,
            path,
        };
    }

    /**
     * Builds a standardized success response.
     *
     * @param data - The payload to return.
     * @param path - The request path.
     * @param statusCode - The HTTP status code of the response.
     * @param message - Optional success message (default: "OK").
     * @returns A success ApiResponse.
     */
    static success<T = any>(
        data: T,
        path: string,
        statusCode: HttpStatus,
        message = 'OK',
    ): ApiResponse<T | null> {
        return this.build({ data, message }, path, statusCode);
    }

    /**
     * Builds a standardized error response.
     *
     * @param path - The request path.
     * @param errors - The error details (e.g. validation errors, exception details).
     * @param statusCode - The HTTP status code of the response.
     * @param message - Optional error message (default: "KO").
     * @returns An error ApiResponse.
     */
    static error(path: string, errors: any, statusCode: HttpStatus, message = 'KO'): ApiResponse {
        return this.build({ errors, message }, path, statusCode);
    }

    /**
     * Universal builder method that determines success or error automatically.
     * - If `errors` is provided and not empty, an error response is built.
     * - Otherwise, a success response is built.
     *
     * @param input - Partial ApiResponse containing `data` or `errors`.
     * @param path - The request path.
     * @param statusCode - The HTTP status code of the response.
     * @returns A standardized ApiResponse.
     */
    static catch<T = any>(
        input: Partial<ApiResponse<T>>,
        path: string,
        statusCode: HttpStatus,
    ): ApiResponse<T | null> {
        return this.build(input, path, statusCode);
    }
}
