import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { UserDTO } from './user.dto';
import { IUserDto, IBotDto, Snowflake } from '@tellme/core';

export class BotDTO implements IBotDto {
  @Expose()
  @Transform(({ value }) => value?.toString())
  id: Snowflake;

  @Exclude() // Hide token when transforming to plain object
  token: string;

  @Expose()
  @Type(() => UserDTO)
  user?: IUserDto;
}
