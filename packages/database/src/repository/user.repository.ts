import { Injectable } from '@nestjs/common';
import { DatabaseService, Prisma } from '../services/database.service';
import { plainToInstance } from 'class-transformer';
import { UserDTO, BotDTO, Snowflake } from './../lib/common';

@Injectable()
export class UserRepository {
    protected PASSWORD_SALT_ROUNDS: number;

    constructor(private db: DatabaseService) {
        // Number of bcrypt salt rounds used for password hashing
        this.PASSWORD_SALT_ROUNDS = Number(process.env.PASSWORD_SALT_ROUNDS) ?? 10;
    }

    /**
     * Converts a raw database User model into a UserDTO.
     * Removes circular references and ensures only exposed fields are mapped.
     *
     * @param user - The raw User entity from the database
     * @returns UserDTO or null if user is not provided
     */
    public pTIUser(user: any): UserDTO | null {
        if (!user) return null;

        // Avoid circular reference (User -> Bot -> User)
        const userWithBot = {
            ...user,
            bot: user.bot ? { ...user.bot, user: undefined } : undefined,
        };

        return plainToInstance(UserDTO, userWithBot, { excludeExtraneousValues: true });
    }

    /**
     * Shortcut to access the raw Prisma user model.
     */
    get raw() {
        return this.db.user;
    }

    /**
     * Converts a raw database Bot model into a BotDTO.
     * Removes circular references and ensures only exposed fields are mapped.
     *
     * @param bot - The raw Bot entity from the database
     * @returns BotDTO or null if bot is not provided
     */
    public pTIBot(bot: any): BotDTO | null {
        if (!bot) return null;

        // Avoid circular reference (Bot -> User -> Bot)
        const botWithUser = {
            ...bot,
            user: bot.user ? { ...bot.user, bot: undefined } : undefined,
        };

        return plainToInstance(BotDTO, botWithUser, { excludeExtraneousValues: true });
    }

    /**
     * Finds a user by their unique ID.
     *
     * @param id - User ID as bigint
     * @returns UserDTO or null if not found
     */
    async findById(id: bigint): Promise<UserDTO | null> {
        const user = await this.db.user.findUnique({ where: { id } });
        return this.pTIUser(user);
    }

    /**
     * Creates a new user in the database.
     *
     * @param data - User data (id, username, email, hashedPassword)
     * @returns The newly created UserDTO
     */
    async createUser(data: { id: string | bigint; username: string; email: string; hashedPassword: string; lang: string; }): Promise<UserDTO> {
        const id: bigint = BigInt(data.id);
        const user = await this.db.user.create({ 
            data: {
                id,
                password: data.hashedPassword,
                isConfirmed: false,
                email: data.email, 
                username: data.username,
                lang: data.lang,
            },
        });
        return this.pTIUser(user) as UserDTO;
    }

    /**
     * Finds a user by their unique email.
     *
     * @param email - Email address
     * @returns UserDTO or null if not found
     */
    async findByEmail(email: string): Promise<UserDTO | null> {
        const user = await this.db.user.findUnique({ where: { email } });
        return this.pTIUser(user);
    }

    /**
     * Finds a user using Prisma's findUnique (only works with @id or @unique fields).
     *
     * @param args - Prisma findUnique args
     * @returns UserDTO or null if not found
     */
    async findUnique(args: Prisma.UserFindUniqueArgs): Promise<UserDTO | null> {
        const user = await this.raw.findUnique(args);
        return this.pTIUser(user);
    }

    /**
     * Finds the first user matching the given conditions.
     * Supports filtering by non-unique fields and relations.
     *
     * @param args - Prisma findFirst args
     * @returns UserDTO or null if not found
     */
    async findFirst(args: Prisma.UserFindFirstArgs): Promise<UserDTO | null> {
        const user = await this.raw.findFirst(args);
        return this.pTIUser(user);
    }

    /**
     * Finds multiple users matching the given conditions.
     *
     * @param args - Prisma findMany args
     * @returns An array of UserDTO
     */
    async findMany(args: Prisma.UserFindManyArgs): Promise<UserDTO[]> {
        const users = await this.raw.findMany(args);

        // Convert to DTOs in a single pass (no nulls kept)
        return users.reduce<UserDTO[]>((acc, user) => {
            const dto = this.pTIUser(user);
            if (dto) acc.push(dto);
            return acc;
        }, []);
    }

    /**
     * Updates an existing user with the given data.
     *
     * @param id - User ID
     * @param data - Partial user data (excluding ID)
     * @returns The updated UserDTO
     */
    async update(id: bigint | Snowflake, data: object): Promise<UserDTO> {
        delete (data as any).id; // Ensure ID is not overwritten

        const user = await this.db.user.update({
            where: { id: BigInt(id) },
            data: { ...data },
        });
        return this.pTIUser(user) as UserDTO;
    }

    /**
     * Finds a user that is associated with a bot by its client ID.
     * Includes the bot relation in the query.
     *
     * @param botId - Bot's client ID
     * @returns UserDTO or null if not found
     */
    async findBotById(botId: Snowflake | bigint): Promise<UserDTO | null> {
        return await this.findFirst({
            where: { id: BigInt(botId) },
            include: { bot: true },
        });
    }
    /**
     * Deletes a user by their unique ID.
     * @param id - User ID (Snowflake or bigint)
     * @returns The deleted UserDTO if found, otherwise null
     */
    async deleteUser(id: Snowflake | bigint): Promise<UserDTO | null> {
        const user = await this.db.user.delete({
            where: { id: BigInt(id) },
        });
        return this.pTIUser(user);
    }
}
