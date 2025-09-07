import { Snowflake } from "src/lib";

export class GetUserQuery {
  constructor(public readonly id: Snowflake, public readonly full = false) {}
}
