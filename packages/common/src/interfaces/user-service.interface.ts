import { Snowflake } from './../lib/core';
import { LoginDto, RegisterDto, UpdateUserDto, UserDTO } from '../dto';

export const USER_SERVICE = Symbol('USER_SERVICE');

export interface IUserService {
  findById(id:  Snowflake | bigint, full?: boolean): Promise<UserDTO | null>;
  registerUser(dto: RegisterDto): Promise<UserDTO>;
  checkLogin(dto: LoginDto): Promise<UserDTO | null>;
  checkBotLogin(id:  Snowflake | bigint, token: string): Promise<UserDTO | null>;
  getMe(ctx: any): Promise<UserDTO | null>;
  updatePassword(id:  Snowflake | bigint, password: string, oldPassword: string, ctx: object): Promise<any>;
  patchMe(dto: UpdateUserDto, ctx: any): Promise<UserDTO>; 
  searchUsers(term: string, ctx: any): Promise<UserDTO[]>;
}