import { IUserDto, IBotDto, Snowflake } from "./../../../lib/core";
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BotDTO } from "./bot.dto";

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
}