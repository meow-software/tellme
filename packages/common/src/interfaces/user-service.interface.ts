import { UserDTO } from '../dto';

export interface IUserService {
  findById(id: string): Promise<UserDTO | null>;
}