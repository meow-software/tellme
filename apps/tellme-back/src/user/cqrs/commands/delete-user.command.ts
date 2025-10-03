import { Snowflake } from "src/lib/common";

export class DeleteUserCommand {
  constructor(public readonly id: Snowflake | bigint) {}
}