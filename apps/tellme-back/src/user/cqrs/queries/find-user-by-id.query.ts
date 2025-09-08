import { Snowflake } from "@tellme/common";

export class FindUserByIdQuery {
  constructor(public readonly id: Snowflake | bigint, public readonly full = false) {}
}
