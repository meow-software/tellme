
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchUsersQuery } from '../search-users.query';
import { UserRepository } from 'src/lib/database';

@QueryHandler(SearchUsersQuery)
export class SearchUsersHandler implements IQueryHandler<SearchUsersQuery> {
  constructor(
    private userRepository: UserRepository, 
  ) {}

  async execute(query: SearchUsersQuery) {
    return this.userRepository.findMany({
      where: {
        OR: [
          { username: { contains: query.term, mode: 'insensitive' } },
          { email: { contains: query.term, mode: 'insensitive' } },
        ],
      },
    });
  }
}
