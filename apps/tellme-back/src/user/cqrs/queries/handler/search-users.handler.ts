
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchUsersQuery } from '../search-users.query';
import { DatabaseService } from 'src/lib';

@QueryHandler(SearchUsersQuery)
export class SearchUsersHandler implements IQueryHandler<SearchUsersQuery> {
  constructor(private db: DatabaseService) {}

  async execute(query: SearchUsersQuery) {
    return this.db.user.findMany({
      where: {
        OR: [
          { username: { contains: query.term, mode: 'insensitive' } },
          { email: { contains: query.term, mode: 'insensitive' } },
        ],
      },
    });
  }
}
