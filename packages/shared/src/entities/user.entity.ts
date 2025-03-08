import { ISnowflakeGenerator } from "@tellme/common";
import { SnowflakeEntity } from "./abstract.entity";

/**
 * Represents a user entity with a username, and email.
 * This class extends from SnowflakeEntity and provides properties for user-related information.
 */
export class User extends SnowflakeEntity {

  /** The username of the user. */
  username: string;

  /** The email of the user. */
  email: string;

  /**
   * Creates an instance of User.
   * @param id The unique identifier for the user (Snowflake ID).
   * @param username The username of the user.
   * @param email The email address of the user.
   * @param createdAt The creation timestamp of the user. If not provided, the current date will be used.
   * @param updatedAt The update timestamp of the user. If not provided, the current date will be used.
   */
  constructor(id: string, username: string, email: string, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this.username = username;
    this.email = email;
  }

  /**
   * Creates a new User instance with a generated Snowflake ID.
   * @param snowflakeGenerator The generator responsible for creating the Snowflake ID.
   * @param username The username of the user.
   * @param email The email address of the user.
   * @returns A new instance of User with a generated Snowflake ID.
   */
  static new(snowflakeGenerator: ISnowflakeGenerator, username: string, email: string) {
    const newUser = new User(
      snowflakeGenerator.generate(),
      username,
      email
    );
    return newUser;
  }
}
