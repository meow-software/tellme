import { Injectable } from '@nestjs/common';
import { BaseRepository, PrismaService } from '@tellme/common';
import { UserEntity } from './../../entities/';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity, typeof PrismaService.prototype.user> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma.user);
  }

  /**
   * Finds a unique user by a specified condition.
   * 
   * This method uses a `findUnique` call to retrieve a user from the repository 
   * and converts the result into a `UserEntity` instance. If no user is found, 
   * it returns `null`. If a user is found, it maps the raw Prisma model to a 
   * `UserEntity` object using the `UserEntity.fromModel` method.
   * 
   * @param requests - The search criteria, including `where` for the condition
   *                   and an optional `select` to specify which fields to return.
   * 
   * @returns The `UserEntity` instance representing the found user, or `null` 
   *          if no user is found.
   * 
   * @example
   * const user = await this.findUnique({ where: { email: 'test@example.com' } });
   * if (user) {
   *   console.log(user.email);  // Access properties of the UserEntity
   * }
   */
  async findUnique(requests: { select?: any, where: any }): Promise<UserEntity | null> {
    console.log("--ici")
    const user = await super.findUnique(requests);
    if (!user) return user;
    return UserEntity.fromModel(user);
  }
}
