import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { REGEX_SNOWFLAKE } from '../..';

/**
 * Custom validator to check if a string is a valid Snowflake ID.
 * A Snowflake ID must:
 * - Be exactly 18 characters long
 * - Contain only digits
 */
@ValidatorConstraint({ async: false })
export class IsSnowflakeConstraint implements ValidatorConstraintInterface {

  /**
   * Validation logic for the Snowflake ID
   * @param id - the value to validate
   * @returns true if the ID is valid, false otherwise
   */
  validate(id: any) {
    const regex = REGEX_SNOWFLAKE;
    return typeof id === 'string' && regex.test(id);
  }

}

/**
 * Decorator function to apply the Snowflake validator
 * @param validationOptions - optional validation options
 */
export function IsSnowflake(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSnowflakeConstraint,
    });
  };
}
