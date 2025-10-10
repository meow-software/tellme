import { Injectable } from '@nestjs/common';
import { DatabaseService, Prisma } from '../services/database.service';
import { plainToInstance } from 'class-transformer';
import { UserDTO, BotDTO, Snowflake, generateUniqueUsername, Provider } from './../lib/common';
import { AuthProvider } from '@tellme/database/client';

function providerResolver(provider: Provider): AuthProvider {
    switch (provider.toLocaleLowerCase()) {
        case 'google':
            return AuthProvider.google;
        case 'facebook':
            return AuthProvider.facebook;
        default:
            throw new Error(`Unknown provider: ${provider}`)
    }
}

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
            // with bot
            bot: user.bot ? { ...user.bot, user: undefined } : undefined,
            // with providers
            providers: user.providers ? user.providers.map((provider: any) => ({ ...provider, user: undefined })) : undefined,
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
     * Creates or retrieves a user based on OAuth provider login.
     * 
     * Flow:
     * 1. Check if a user already exists with this provider (OAuth link) or email.
     * 2. If the provider is already linked → return the existing user.
     * 3. If the user exists by email but not provider → link the new provider.
     * 4. If no user exists → create a new one with provider.
     *
     * @precondition
     * This function must only be called for OAuth logins (e.g., Google, Facebook)
     * where the provider guarantees that the user's email is verified.
     * 
     * Rationale: if the OAuth provider grants access and confirms the email,
     * it is considered safe to assume the user legitimately owns that account.
     * Therefore, any user having a confirmed email through a trusted provider
     * should be automatically linked or logged into their corresponding account.
     *
     * @param data - The OAuth registration data:
     *   - id: the new user ID (BigInt)
     *   - provId: the new provider relation ID (BigInt)
     *   - provider: the OAuth provider (e.g., 'google', 'facebook')
     *   - providerId: the unique provider user ID (e.g., Google "sub" value)
     *   - email: user's email verified (if available)
     *   - username: username suggestion (from provider or generated)
     *
     * @returns The existing or newly created user, including providers.
     */
    async getOrCreateOAuthUser(data: { id: string | bigint; provId: string | bigint; provider: Provider; providerId: string; email: string; username: string; }): Promise<UserDTO> {
        const { provider, providerId, email, username } = data;
        const id: bigint = BigInt(data.id);
        const provId: bigint = BigInt(data.provId);

        // Check if the user exists by provider or email
        const userWithProviderOrEmail = await this.db.user.findFirst({
            where: {
                OR: [
                    // Look for an existing user linked to this OAuth provider
                    { providers: { some: { provider: providerResolver(provider), providerId } } },
                    // Or a user registered with the same email
                    { email },
                ],
            },
            include: { providers: true },
        });

        // If provider already linked → login
        if (
            userWithProviderOrEmail &&
            userWithProviderOrEmail.providers.some(
                (p) => p.provider === provider && p.providerId === providerId,
            )
        ) {
            return this.pTIUser(userWithProviderOrEmail) as UserDTO;
        }

        // If user exists by email → link this provider
        if (userWithProviderOrEmail) {
            await this.db.userProvider.create({
                data: {
                    id: provId,
                    provider,
                    providerId,
                    userId: userWithProviderOrEmail.id,
                },
            });

            return this.pTIUser(userWithProviderOrEmail) as UserDTO;
        }

        // If user does not exist → create new user with provider
        const newUser = await this.db.user.create({
            data: {
                id: id,
                username: generateUniqueUsername(username),
                email,
                isConfirmed: true, // OAuth accounts are trusted by default
                password: null, // no password for provider-based accounts
                providers: {
                    create: {
                        id: provId,
                        provider,
                        providerId,
                    },
                },
            },
            include: { providers: true },
        });

        return this.pTIUser(newUser) as UserDTO;
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
