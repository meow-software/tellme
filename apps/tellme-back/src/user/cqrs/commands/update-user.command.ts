import { Snowflake, UpdateUserDto } from "src/lib/common";

export class UpdateUserCommand {
  constructor(public readonly id: Snowflake, public readonly dto: UpdateUserDto) {}
}
