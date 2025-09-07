import { UserDTO } from '../dto';

export const USER_SERVICE = Symbol('USER_SERVICE');

export interface IUserService {
  findById(id: string): Promise<UserDTO | null>;
}