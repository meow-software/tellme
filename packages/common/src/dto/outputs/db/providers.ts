import { Expose, Transform, Type } from 'class-transformer';
import { UserDTO } from './user.dto';
import { IProviderDto, IUserDto, Provider, Snowflake } from './../../../lib/core';

export class ProviderDTO implements IProviderDto {
  @Expose()
  @Transform(({ value }) => value?.toString())
  id: Snowflake;

  @Expose()
  provider: Provider | null; 

  @Expose()
  providerId: string;

  @Expose()
  @Type(() => UserDTO)
  user?: IUserDto;
}
