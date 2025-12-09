import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';

export class GetUsersQuery {}

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) {}

  async execute() {
    const users = await this.repo.find();
    return users.map(u => {
      const x = { ...u } as any;
      delete x.password;
      return x;
    });
  }
}
