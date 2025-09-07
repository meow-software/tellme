import { Snowflake } from "src/lib";

export class DeleteUserCommand {
  constructor(public readonly id: Snowflake) {}
}