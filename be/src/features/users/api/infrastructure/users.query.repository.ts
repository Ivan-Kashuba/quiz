import { Injectable } from '@nestjs/common';

import { Like } from 'typeorm';
import { TypeOrmHelper } from '../../../../infrastructure/helpers/typeorm/typeorm-helper';
import { PaginationInputModel } from '../../../../infrastructure/pagination/models/input/pagination.input.model';
import { PaginationOutputModel } from '../../../../infrastructure/pagination/models/output/pagination.output.model';
import {
  UserOutputModel,
  UserOutputModelMapper,
} from '../models/output/user.output.model';
import { User } from '../domain/User';

@Injectable()
export class UsersQueryRepository {
  constructor(private readonly typeOrmHelper: TypeOrmHelper) {}

  async findQuestions(
    usernameSearchTerm: string | null,
    pagination: PaginationInputModel,
  ): Promise<PaginationOutputModel<UserOutputModel>> {
    const { order, skip, limit } = pagination;

    const validatedOrderBy = this.typeOrmHelper.validateFieldInEntity(
      User,
      pagination.orderBy,
    );

    const query = User.createQueryBuilder('u')
      .where('u.isActive = :isActive', { isActive: true })
      .orderBy(`u.${validatedOrderBy || 'createdAt'}`, order)
      .take(limit)
      .skip(skip);

    if (usernameSearchTerm) {
      query.andWhere('LOWER(u.username) LIKE :username', {
        username: `%${usernameSearchTerm.toLowerCase()}%`,
      });
    }

    const [dbUsers, total] = await query.getManyAndCount();

    const viewModelUsers: UserOutputModel[] = dbUsers.map(
      UserOutputModelMapper,
    );

    return new PaginationOutputModel(viewModelUsers, total, pagination);
  }
}
