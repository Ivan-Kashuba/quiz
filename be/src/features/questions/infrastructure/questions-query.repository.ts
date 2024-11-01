import { Injectable } from '@nestjs/common';

import { Question } from '../domain/Question';
import { Like } from 'typeorm';
import { QuestionOutputModel } from '../api/models/output/question.output.model';
import { PaginationInputModel } from '../../../infrastructure/pagination/models/input/pagination.input.model';
import { PaginationOutputModel } from '../../../infrastructure/pagination/models/output/pagination.output.model';
import { TypeOrmHelper } from '../../../infrastructure/helpers/typeorm/typeorm-helper';

@Injectable()
export class QuestionsQueryRepository {
  constructor(private readonly typeOrmHelper: TypeOrmHelper) {}

  async findQuestions(
    bodySearchTerm: string | null,
    publishedStatus: string | null,
    pagination: PaginationInputModel,
  ): Promise<PaginationOutputModel<QuestionOutputModel>> {
    const { order, skip, limit } = pagination;

    const validatedOrderBy = this.typeOrmHelper.validateFieldInEntity(
      Question,
      pagination.orderBy,
    );

    let filters = {};

    if (bodySearchTerm) {
      filters = { body: Like('%' + bodySearchTerm + '%') };
    }

    if (publishedStatus) {
      filters = { ...filters, published: publishedStatus };
    }

    const [dbQuizQuestions, total] = await Question.findAndCount({
      where: { ...filters, isActive: true },
      order: { [validatedOrderBy || 'createdAt']: order },
      relations: { answers: true },
      take: limit,
      skip: skip,
    });

    const viewModelFoundedQuestions: QuestionOutputModel[] =
      dbQuizQuestions.map((question) => {
        return {
          id: question.id,
          body: question.body,
          published: question.published,
          correctAnswers: question.answers.map((q) => q.content),
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
        };
      });

    return new PaginationOutputModel(
      viewModelFoundedQuestions,
      total,
      pagination,
    );
  }
}
