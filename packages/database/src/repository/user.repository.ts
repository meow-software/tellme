import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from '@tellme/common';
import { User } from '@tellme/database/client';

type ModelUser = User | null;

@Injectable()
export class UserRepository {
    constructor(private db: DatabaseService) { }
    protected pTIUser(user: ModelUser): UserDTO | null {
        console.log(user)
        let i =  plainToInstance(UserDTO, {
            ...user,
        }, { excludeExtraneousValues: true });

        console.log("---i", i) ;
        return i;
    }

    async findById(id: bigint): Promise<UserDTO | null> {
        const user: ModelUser = await this.db.user.findUnique({ where: { id } });
        console.log("---li",)
        return this.pTIUser(user);
    }
}
