import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../get-user.query';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) {}

  async execute(query: GetUserQuery) {
    const user = await this.repo.findOne({ where: { id: query.id }});
    if (!user) throw new Error('User not found');
    delete (user as any).password;
    return user;
  }
}
