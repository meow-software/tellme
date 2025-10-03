import { Snowflake } from "src/lib/common";

export class FindUserByIdQuery {
  constructor(public readonly id: Snowflake | bigint, public readonly full = false) {}
}
