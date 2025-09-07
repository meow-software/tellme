import { IUserDto } from "@tellme/core";
import { Exclude, Expose, Transform } from 'class-transformer';

export class UserDTO implements IUserDto{
  @Expose()
  @Transform(({ value }) => value?.toString())
  id: string; 
  
  @Expose()
  username: string; 
  
  @Exclude()
  password?: string;

  @Expose()
  email: string | null; 
  
  @Expose()
  isConfirmed: boolean;
}