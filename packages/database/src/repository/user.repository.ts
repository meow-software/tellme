import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService, Prisma } from '../services/database.service';
import { plainToInstance } from 'class-transformer';
import { hash, compare, UserDTO, BotDTO, LoginDto } from '@tellme/common';


@Injectable()
export class UserRepository {
    protected PASSWORD_SALT_ROUNDS;
    constructor(private db: DatabaseService) {
        this.PASSWORD_SALT_ROUNDS = Number(process.env.PASSWORD_SALT_ROUNDS) ?? 10;
    }

    /**
     * Converts a database User model to a UserDTO.
     * @param user - The database user model
     * @returns UserDTO or null
     */
    protected pTIUser(user: any): UserDTO | null {
        if (!user) return null;
        let userWithBot = {
            ...user,
            bot: user.bot ? { ...user.bot, user: undefined } : undefined, // avoid circular reference
        };
        return plainToInstance(UserDTO, userWithBot, { excludeExtraneousValues: true });
    }


    /**
     * Converts a database Bot model to a BotDTO.
     * @param bot - The database bot model
     * @returns BotDTO or null
     */
    protected pTIBot(bot: any): BotDTO | null {
        if (!bot) return null;
        let botWithUser = {
            ...bot,
            bot: bot.user ? { ...bot.user, bot: undefined } : undefined, // avoid circular reference
        };
        return plainToInstance(BotDTO, botWithUser, { excludeExtraneousValues: true });
    }

    /**
     * Finds a user by their unique ID.
     */
    async findById(id: bigint): Promise<UserDTO | null> {
        const user = await this.db.user.findUnique({ where: { id } });
        return this.pTIUser(user);
    }

    /**
     * Creates a new user in the database.
     */
    async createUser(data: { id: string | bigint; username: string; email: string; password: string; }): Promise<UserDTO> {
        const hashedPassword = await hash(data.password, this.PASSWORD_SALT_ROUNDS);
        const id: bigint = data.id as bigint;
        const user = await this.db.user.create({
            data: {
                id: id,
                username: data.username,
                email: data.email,
                password: hashedPassword,
                isConfirmed: false,
            },
        });
        return this.pTIUser(user) as UserDTO;
    }

    /**
     * Finds a user by email.
     */
    async findByEmail(email: string): Promise<UserDTO | null> {
        const user = await this.db.user.findUnique({ where: { email } });
        return this.pTIUser(user);
    }


    async findUnique(
        args: Prisma.UserFindUniqueArgs
    ): Promise<UserDTO | null> {
        const user = await this.db.user.findUnique(args);
        return this.pTIUser(user);
    }


    protected async findRawUserByEmailOrUsername(emailOrUsername: string) {
        return await this.db.user.findFirst({
            where: {
                OR: [
                    { username: emailOrUsername },
                    { email: emailOrUsername },
                ],
            },
        });
    }

    async findUserByEmailOrUsername(emailOrUsername: string): Promise<UserDTO | null> {
        return this.pTIUser(this.findRawUserByEmailOrUsername(emailOrUsername));
    }

    async checkUserLogin(dto: LoginDto): Promise<UserDTO | null> {
        const user = await this.findRawUserByEmailOrUsername(dto.usernameOrEmail);
        if (!!user && await compare(dto.password, user.password)) {
            return this.pTIUser(user);
        }
        return null;
    }

    /**
     * Verifies that the provided password matches the stored hash.
     */
    async verifyPassword(userId: bigint, password: string): Promise<boolean> {
        const user = await this.db.user.findUnique({ where: { id: userId } });
        if (!user) return false;
        return await compare(password, user.password);
    }

    /**
     * Updates the password for a given user.
     */
    async updatePassword(userId: bigint, newPassword: string): Promise<UserDTO> {
        const hashedPassword = await hash(newPassword, this.PASSWORD_SALT_ROUNDS);
        const user = await this.db.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return this.pTIUser(user) as UserDTO;
    }

    /**
     * Finds a bot user by its client ID.
     */
    async findBotById(botId: string): Promise<UserDTO | null> {
        const user = await this.db.user.findUnique({
            where: { id: BigInt(botId) },
            include: { bot: true },
        });
        if (!user || !user.bot) return null;
        return this.pTIUser(user);
    }
}
