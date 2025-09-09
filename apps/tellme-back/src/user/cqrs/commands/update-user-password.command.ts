import { Snowflake, UpdateUserDto } from "@tellme/common";

export class UpdateUserPasswordCommand {
  constructor(public readonly userId: Snowflake, public readonly password: string, public readonly oldPassword: string) {}
}
