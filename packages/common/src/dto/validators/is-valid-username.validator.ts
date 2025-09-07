import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { REGEX_USERNAME } from '../..';

/**
 * Custom validator to check if a username is valid.
 * A valid username must:
 * - Be between 3 and 20 characters long
 * - Contain only letters, numbers, periods (.) or underscores (_)
 */
@ValidatorConstraint({ async: false })
export class IsValidUsernameConstraint implements ValidatorConstraintInterface {
  
  /**
   * Validation logic for the username
   * @param username - the value to validate
   * @returns true if the username is valid, false otherwise
   */
  validate(username: any) {
    const regex = REGEX_USERNAME;
    return typeof username === 'string' && regex.test(username);
  }
}

/**
 * Decorator function to apply the username validator
 * @param validationOptions - optional validation options
 */
export function IsValidUsername(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions, 
      constraints: [],
      validator: IsValidUsernameConstraint,
    });
  };
}
