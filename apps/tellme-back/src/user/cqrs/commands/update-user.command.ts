import { Snowflake, UpdateUserDto } from "@tellme/common";

export class UpdateUserCommand {
  constructor(public readonly id: Snowflake, public readonly dto: UpdateUserDto) {}
}
