import { Injectable } from '@nestjs/common';
import { BaseRepository, PrismaService } from '@tellme/common';
import { UserEntity } from './../../entities/';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity, typeof PrismaService.prototype.user> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma.user);
  }
}
