import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DatabaseService } from '../services/database.service';

@Module({
    providers: [
        UserRepository,
        DatabaseService,
    ],
    exports: [
        UserRepository,
        DatabaseService,
    ]
})
export class RepositoryModule { }
