/**
 * Utility class to format objects or arrays before sending them in responses.
 *
 * Features:
 * - Removes specified sensitive or unwanted keys.
 * - Converts all BigInt values to strings for safe JSON serialization.
 */
export class ResponseFormatter {
  /**
   * Formats an object or array recursively.
   *
   * @template T - Type of the input data
   * @param data - The object, array, or primitive value to format
   * @param removeKeys - List of keys to remove from objects (default: [])
   * @returns The formatted object/array with specified keys removed and BigInts converted to strings
   *
   * @example
   * ```ts
   * const formatter = new ResponseFormatter();
   * const result = formatter.format({ id: 1n, password: 'secret' }, ['password']);
   * // result = { id: "1" }
   * ```
   */
  format<T>(data: T, removeKeys: string[] = []): T {
    if (Array.isArray(data)) {
      return data.map(item => this.format(item, removeKeys)) as any;
    } else if (data && typeof data === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(data)) {
        // Skip keys that should be removed
        if (removeKeys.includes(key)) continue;

        if (typeof value === 'bigint') {
          // Convert BigInt to string
          result[key] = value.toString();
        } else if (Array.isArray(value) || (value && typeof value === 'object')) {
          // Recursively format nested objects or arrays
          result[key] = this.format(value, removeKeys);
        } else {
          result[key] = value;
        }
      }
      return result;
    }
    // Return primitive values as-is
    return data;
  }
}
