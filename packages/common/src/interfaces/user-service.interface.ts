import { BotDTO, LoginDto, RegisterDto, UserDTO } from '../dto';

export const USER_SERVICE = Symbol('USER_SERVICE');

export interface IUserService {
  findById(id: string, full?: boolean): Promise<UserDTO | null>;
  registerUser(dto: RegisterDto): Promise<UserDTO>;
  checkLogin(dto: LoginDto): Promise<UserDTO | null>;
  checkBotLogin(id: string, token: string): Promise<BotDTO | null>;
  getMe(ctx: any): Promise<UserDTO | null>;
  editPassword(id: string, password: string, oldPassword: string, ctx: any): Promise<UserDTO>;
  patchMe(dto: any): Promise<UserDTO>;
  // resendConfirmationEmail?(userId: string): Promise<void>;
}