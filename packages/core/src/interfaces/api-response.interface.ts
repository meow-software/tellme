export interface ApiResponse<T = any> {
    /**
     * Indicates whether the request was successful or not.
     * - `true`: success response
     * - `false`: error response
     */
    success: boolean;

    /**
     * The actual payload returned in case of success.
     * Will be `null` if the response is an error.
     */
    data: T | null;

    /**
     * Human-readable message describing the response.
     * Can be a success message or an error description.
     */
    message: string;

    /**
     * Additional error details if the request failed.
     * Will be `null` if the response is successful.
     */
    errors: any | null;

    /**
     * The server timestamp (ISO 8601) when the response was created.
     */
    timestamp: string;

    /**
     * The HTTP status code of the response.
     */
    statusCode: number;

    /**
     * The request path that generated this response.
     */
    path: string;
}
