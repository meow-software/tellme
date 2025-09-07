import { LoginDto, RegisterDto, UserDTO } from '../dto';

export const USER_SERVICE = Symbol('USER_SERVICE');

export interface IUserService {
  findById(id: string): Promise<UserDTO | null>;
  registerUser(dto: RegisterDto): Promise<UserDTO>;
  checkLogin(dto: LoginDto): Promise<UserDTO | null>;
  getMe(ctx: any): Promise<UserDTO | null>;
  resetPassword(userId: string, password: string, oldPassword?: string): Promise<UserDTO>;
  checkBotLogin(id: string, token: string): Promise<UserDTO | null>;
  resendConfirmationEmail?(userId: string): Promise<void>;
}