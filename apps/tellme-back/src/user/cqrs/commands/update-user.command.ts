import { Snowflake, UpdateUserDto } from "src/lib";

export class UpdateUserCommand {
  constructor(public readonly userId: Snowflake, public readonly dto: UpdateUserDto) {}
}
