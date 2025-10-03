import { Snowflake, UpdateUserDto } from "src/lib/common";

export class UpdateUserPasswordCommand {
  constructor(public readonly userId: Snowflake, public readonly password: string, public readonly oldPassword: string) {}
}
