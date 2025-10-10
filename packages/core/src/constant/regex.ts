/**
 * REGEX_USERNAME
 * - Allows letters (uppercase and lowercase), digits, dot (.) and underscore (_)
 * - Must be between 3 and 20 characters long
 * - Valid examples: "John_Doe", "alex.01", "User123"
 */
export const REGEX_USERNAME = /^[a-zA-Z0-9._]{3,20}$/;
export const USERNAME_SIZE = [3, 20] as const;

/**
 * REGEX_SNOWFLAKE
 * - Matches a numeric Snowflake-style ID (commonly used for unique identifiers)
 * - Must be a string of 17 to 18 digits
 * - Valid examples: "12345678901234567", "987654321012345678"
 */
export const REGEX_SNOWFLAKE = /^\d{17,18}$/;

/**
 * REGEX_PASSWORD
 * - Validates password strength.
 * - Requirements:
 *    1. Minimum 8 characters
 *    2. At least one lowercase letter
 *    3. At least one uppercase letter
 *    4. At least one digit
 *    5. At least one special character from @$!%*?&.
 * - Valid examples:
 *    - "Password1!"
 *    - "S3cure@Pass"
 * - Invalid examples:
 *    - "pass" (too short)
 *    - "password" (missing uppercase, digit, and symbol)
 */
export const REGEX_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

/**
 * REGEX_MAIL
 * - Validates the format of an email address.
 * - Requirements:
 *    1. Must contain exactly one "@" symbol
 *    2. No spaces allowed
 *    3. Must have at least one character before "@"
 *    4. Must have at least one character between "@" and the last "."
 *    5. Must have at least one character after the last "."
 * - Valid examples:
 *    - "john.doe@gmail.com"
 *    - "user123@domain.co"
 * - Invalid examples:
 *    - " john@doe.com" (space at the start)
 *    - "john@@gmail.com" (double @)
 *    - "john@.com" (nothing before the dot)
 */
export const REGEX_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
