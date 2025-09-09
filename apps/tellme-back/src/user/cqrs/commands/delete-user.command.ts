import { Snowflake } from "@tellme/common";

export class DeleteUserCommand {
  constructor(public readonly id: Snowflake | bigint) {}
}