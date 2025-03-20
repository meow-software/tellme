import { ISnowflakeGenerator } from "@tellme/common"; 
import * as bcrypt from "bcrypt";
import { SnowflakeEntity } from "./abstract.entity";

/**
 * Represents a user entity with a username, and email.
 * This class extends from SnowflakeEntity and provides properties for user-related information.
 */
export class UserEntity extends SnowflakeEntity {

  /** The username of the user. */
  username: string;

  /** The email of the user. */
  email: string;

  /** The password of the user */
  password?: string;
  /**
   * Creates an instance of User.
   * @param id The unique identifier for the user (Snowflake ID).
   * @param username The username of the user.
   * @param email The email address of the user.
   * @param password The password (hashed).
   * @param createdAt The creation timestamp of the user. If not provided, the current date will be used.
   * @param updatedAt The update timestamp of the user. If not provided, the current date will be used.
   */
  constructor(id: BigInt | string, username: string, email: string, password?: string, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this.username = username;
    this.email = email;
    this.password = password;
  }

  /**
   * Compares a given password with the stored hashed password.
   *
   * @param {string} password - The plain-text password to check.
   * @returns {Promise<boolean>} A promise resolving to `true` if the password matches, otherwise `false`.
   * @throws {Error} If an unexpected error occurs during comparison.
   *
   * @example
   * const isValid = await user.checkPassword("mySecretPassword");
   * console.log(isValid); // true or false
   */
  async checkPassword(password: string): Promise<boolean> {
    // Ensure that the stored password is not undefined or null
    if (!this.password) return false;

    try {
      // Compare the provided password with the stored hashed password
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      // Log the error for debugging purposes (optional)
      console.error("Error comparing passwords:", error);
      // Return false in case of an error instead of crashing the app
      return false;
    }
  }


  /**
   * Edit password of user
   * @param password The new password of the user (not hashed).
   */
  async editPassword(password: string) {
    this.password = await bcrypt.hash(password, 10);
  }

  /**
   * Creates a new User instance with a generated Snowflake ID.
   * @param snowflakeGenerator The generator responsible for creating the Snowflake ID.
   * @param username The username of the user.
   * @param email The email address of the user.
   * @param password The password of the user (not hashed).
   * @returns A new instance of User with a generated Snowflake ID.
   */
  static async new(snowflakeGenerator: ISnowflakeGenerator, username: string, email: string, password: string) {
    const newUser = new UserEntity(
      snowflakeGenerator.generate(),
      username,
      email,
      await bcrypt.hash(password, 10)
    );
    return newUser;
  }
}
