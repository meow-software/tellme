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
  lang: string;
  providers?: IProviderDto[];
}

export const PROVIDERS = ['google' ,'facebook'] as const;
export type Provider = typeof PROVIDERS[number];

export interface IProviderDto{
  id: Snowflake;
  provider: Provider | null;
  providerId: string;
  user?: IUserDto;
}