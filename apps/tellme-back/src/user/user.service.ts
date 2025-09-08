import { Injectable, BadRequestException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { IUserService, UserDTO, RegisterDto, LoginDto } from '@tellme/common';
import { UserRepository } from '@tellme/database';
import { FindUserByIdQuery } from './cqrs/queries/find-user-by-id.query';

/**
 * UserService is the concrete implementation of IUserService.
 * It acts as a business-oriented repository for all user-related operations.
 * All methods delegate persistence logic to UserRepository and
 * expose domain-specific operations instead of raw HTTP calls.
 */
@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly userRepo: UserRepository
  ) { }

  /**
   * Finds a user by their unique ID.
   * @param id - User ID as a string
   * @returns UserDTO if found, null otherwise
   */
  async findById(id: string, full:boolean = false): Promise<UserDTO | null> {
    // return this.userRepo.findById(BigInt(id));
    return this.queryBus.execute(new FindUserByIdQuery(id, full));
  }

  /**
   * Registers a new user in the system.
   * @param dto - Registration data (email, password, etc.)
   * @returns The created UserDTO
   * @throws BadRequestException if registration fails
   */
  async registerUser(dto: RegisterDto): Promise<UserDTO> {
    const user = await this.userRepo.create(dto);

    if (!user) {
      throw new BadRequestException('User registration failed.');
    }

    return user;
  }

  /**
   * Validates user credentials for login.
   * @param dto - Login data (email and password)
   * @returns UserDTO if credentials are valid, null otherwise
   */
  async checkLogin(dto: LoginDto): Promise<UserDTO | null> {
    const user = await this.userRepo.checkUserLogin(dto);
    if (!user) return null;

    const isPasswordValid = await this.userRepo.verifyPassword(user.id, dto.password);
    if (!isPasswordValid) return null;

    return user;
  }

  /**
   * Retrieves the currently authenticated user based on request headers.
   * @param ctx - HTTP headers containing authentication info
   * @returns UserDTO if found, null otherwise
   */
  async getMe(ctx: any): Promise<UserDTO | null> {
    const userId = ctx.id;
    if (!userId) return null;
    return this.findById(userId);
  }

  /**
   * Resets a user's password.
   * @param userId - User's unique ID
   * @param password - New password
   * @param oldPassword - Optional: current password for verification
   * @returns Updated UserDTO
   * @throws BadRequestException if reset fails
   */
  async resetPassword(userId: string, password: string, oldPassword?: string): Promise<UserDTO> {
    const user = await this.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    if (oldPassword) {
      const isOldPasswordValid = await this.userRepo.verifyPassword(BigInt(userId), oldPassword);
      if (!isOldPasswordValid) throw new BadRequestException('Invalid old password');
    }

    return this.userRepo.updatePassword(BigInt(userId), password);
  }

  /**
   * Validates bot credentials and returns the associated user.
   * @param id - Bot client ID
   * @param token - Bot secret token
   * @returns UserDTO if valid, null otherwise
   */
  async checkBotLogin(id: string, token: string): Promise<UserDTO | null> {
    const user = await this.userRepo.findBotById(id);
    if (!user) return null;

    if (user.bot && user.bot.token !== token) return null;

    return user;
  }

}
