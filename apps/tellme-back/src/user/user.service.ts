import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { IUserService, UserDTO, RegisterDto, LoginDto, UpdateUserDto, Snowflake, AuthCodes, IAuthenticatedRequest, OAuthUserPayload } from 'src/lib/common';
import { FindUserByIdQuery } from './cqrs/queries/find-user-by-id.query';
import { CreateUserCommand } from './cqrs/commands/create-user.command';
import { CheckLoginQuery } from './cqrs/queries/check-login.query';
import { UpdateUserPasswordCommand } from './cqrs/commands/update-user-password.command';
import { CheckLoginBotQuery } from './cqrs/queries/check-login-bot.query';
import { UpdateUserCommand } from './cqrs/commands/update-user.command';
import { SearchUsersQuery } from './cqrs/queries/search-users.query';
import { GetOrCreateOauthUserCommand } from './cqrs/commands/get-or-create-oauth-user.command';

/**
 * UserService is the concrete implementation of IUserService.
 * It acts as the business-oriented service for all user-related operations.
 * Persistence logic is delegated through the CQRS buses (CommandBus / QueryBus).
 */
@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  /**
   * Finds a user by their unique ID.
   * @param id - User ID (Snowflake or bigint)
   * @param full - If true, fetches related entities (e.g. Bot)
   * @returns UserDTO if found, null otherwise
   */
  async findById(id: Snowflake | bigint, full: boolean = false): Promise<UserDTO | null> {
    return this.queryBus.execute(new FindUserByIdQuery(id, full));
  }

  /**
   * Registers a new user in the system.
   * @param dto - Registration data (username, email, password)
   * @param ctx - Context of request
   * @returns The created UserDTO
   * @throws BadRequestException if registration fails
   */
  async registerUser(dto: RegisterDto, req: IAuthenticatedRequest): Promise<UserDTO> {
    const user = await this.commandBus.execute(new CreateUserCommand(dto.username, dto.email, dto.password, req.userlang));

    if (!user) {
      throw new BadRequestException({
        code: AuthCodes.REGISTRATION_FAILED,
        message: 'User registration failed.'
      });
    }

    return user;
  }

  /**
   * Validates user credentials for login.
   * @param dto - Login data (usernameOrEmail, password)
   * @returns UserDTO if credentials are valid, null otherwise
   */
  async checkLogin(dto: LoginDto): Promise<UserDTO | null> {
    return await this.queryBus.execute(new CheckLoginQuery(dto.usernameOrEmail, dto.password));
  }

  /**
   * Retrieves the currently authenticated user.
   * @param ctx - Request context (e.g. headers, JWT payload)
   * @returns UserDTO if found, null otherwise
   */
  async getMe(req: IAuthenticatedRequest): Promise<UserDTO | null> {
    if (!req || !req.user || !req.user.sub) throw new UnauthorizedException({
      code: AuthCodes.NOT_CONNECTED,
      message: 'User not connected!'
    })
    return this.findById(req.user?.sub);
  }

  /**
   * Updates the password of a user.
   * @param id - User ID
   * @param password - New password
   * @param oldPassword - Current password (used for verification)
   * @param ctx - Request context
   * @returns Updated UserDTO
   * @throws BadRequestException if update fails
   */
  async updatePassword(id: string, password: string, oldPassword: string, ctx: any = {}): Promise<UserDTO> {
    return await this.commandBus.execute(new UpdateUserPasswordCommand(id, password, oldPassword));
  }

  /**
   * Validates bot credentials and returns the associated user.
   * @param id - Bot client ID
   * @param token - Bot secret token
   * @returns UserDTO if valid, null otherwise
   */
  async checkBotLogin(id: string, token: string): Promise<UserDTO | null> {
    return await this.queryBus.execute(new CheckLoginBotQuery(id, token));
  }

  /**
   * Partially updates the profile of the currently authenticated user.
   * @param dto - Data to update (username, email, etc.)
   * @param ctx - Request context containing the authenticated user
   * @returns Updated UserDTO
   * @throws BadRequestException if user is not authenticated
   */
  async patchMe(dto: UpdateUserDto, ctx: any): Promise<UserDTO> {
    if (!ctx || !ctx.user || !ctx.user.id) {
      throw new BadRequestException({
        code: AuthCodes.NOT_CONNECTED,
        message: 'User not connected!'
      });
    }
    return await this.commandBus.execute(new UpdateUserCommand(ctx.user.id, dto));
  }

  /**
   * Searches users by a given term.
   * @param term - Search term in(username, email) (insensitive))
   * @param ctx - Request context
   * @returns A list of UserDTO matching the search term
   */
  async searchUsers(term: string, ctx: any = {}): Promise<UserDTO[]> {
    return await this.queryBus.execute(new SearchUsersQuery(term));
  }
  
  /**
   * Creates or retrieves a user based on OAuth provider login.
   * @param oauthUserPayload - Payload containing OAuth user information
   * @returns The existing or newly created UserDTO
   */
  async getOrCreateOauthUser(oauthUserPayload: OAuthUserPayload) : Promise<UserDTO> {
    return await this.commandBus.execute(
      new GetOrCreateOauthUserCommand(oauthUserPayload),
    );
  }
}
