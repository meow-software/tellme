import { IUserDto, IBotDto, Snowflake, IProviderDto } from "./../../../lib/core";
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BotDTO } from "./bot.dto";
import { ProviderDTO } from "./providers";

export class UserDTO implements IUserDto{
  @Expose()
  @Transform(({ value }) => value?.toString())
  id: Snowflake; 
  
  @Expose()
  username: string; 
  
  @Exclude()
  password?: string;

  @Expose()
  email: string | null; 

  @Expose()
  lang: string;
  
  @Expose()
  isConfirmed: boolean;

  @Expose()
  @Type(() => BotDTO)
  bot?: IBotDto;

  @Expose()
  @Type(() => ProviderDTO)
  providers?: IProviderDto[];
}