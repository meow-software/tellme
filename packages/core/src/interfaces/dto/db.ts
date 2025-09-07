import { Snowflake } from "../..";

export interface IBotDto {
  id : Snowflake;
  token: string;
  user?: IUserDto; 
} 

export interface IUserDto {
  id: Snowflake; 
  username: string; 
  password?: string; 
  email: string | null; 
  isConfirmed: boolean;
  bot?: IBotDto;
}
