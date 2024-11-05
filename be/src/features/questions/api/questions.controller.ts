import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CommandBus } from '@nestjs/cqrs';

import {
  QuestionOutputModel,
  QuestionOutputModelMapper,
} from './models/output/question.output.model';
import { QuestionsQueryRepository } from '../infrastructure/questions.query.repository';
import { QuestionInputModel } from './models/input/create-question.input.model';
import { CreateQuizQuestionCommand } from '../application/use-cases/create-quiz-question.handler';
import { Question } from '../domain/Question';
import { Answer } from '../domain/Answer';
import { UpdateQuestionPublishStatusModel } from './models/input/update-question-publish-status.input.model';
import { PaginationInputModel } from '../../../infrastructure/pagination/models/input/pagination.input.model';
import { AdminAuthGuard } from '../../../infrastructure/guards/admin-auth.guard';
import { PaginationOutputModel } from '../../../infrastructure/pagination/models/output/pagination.output.model';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../infrastructure/pagination/decorators/api-paginated-response/ApiPaginatedResponse ';
import {
  ApiDefaultNoContentResponse,
  ApiDefaultNotFoundResponse,
  ApiDefaultUnauthorizedResponse,
} from '../../../infrastructure/decorators/swagger/default-responses';
import { DataSource, In } from 'typeorm';
import { getAndValidateIds } from '../../../infrastructure/helpers/delete-entities/delete-entities';

@ApiSecurity('basic')
@ApiDefaultUnauthorizedResponse()
@ApiTags('Questions management')
@Controller('sa')
export class QuestionsController {
  constructor(
    private readonly questionsQueryRepository: QuestionsQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly dataSource: DataSource,
  ) {}

  @Get('questions')
  @UseGuards(AdminAuthGuard)
  @ApiQuery({
    name: 'publishedStatus',
    type: Boolean,
    required: false,
    description: 'Search by publish status',
  })
  @ApiQuery({
    name: 'bodySearchTerm',
    type: String,
    required: false,
    description: 'Search by body',
  })
  @ApiBadRequestResponse({
    description: 'Invalid query params',
  })
  @ApiPaginatedResponse(QuestionOutputModel)
  async getQuizQuestions(
    @Query()
    queryParams: {
      bodySearchTerm?: string;
      publishedStatus?: string;
    },
    @Query() paginationInputModel: PaginationInputModel,
  ): Promise<PaginationOutputModel<QuestionOutputModel>> {
    const bodySearchTerm = queryParams?.bodySearchTerm || null;
    const publishedStatus =
      queryParams?.publishedStatus !== undefined
        ? queryParams?.publishedStatus
        : null;

    return await this.questionsQueryRepository.findQuestions(
      bodySearchTerm,
      publishedStatus,
      paginationInputModel,
    );
  }

  @Get('questions/:questionId')
  @UseGuards(AdminAuthGuard)
  @ApiParam({ name: 'questionId' })
  @ApiDefaultNotFoundResponse()
  @ApiBadRequestResponse({
    description: 'Invalid param questionId',
  })
  @ApiOkResponse({ type: QuestionOutputModel })
  async getQuizById(
    @Param('questionId', ParseUUIDPipe) questionId: string,
  ): Promise<QuestionOutputModel> {
    const question = await Question.findOne({
      where: { id: questionId },
      relations: { answers: true },
    });

    if (!question) {
      throw new NotFoundException();
    }

    return QuestionOutputModelMapper(question);
  }

  @Post('questions')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminAuthGuard)
  @ApiCreatedResponse({
    type: QuestionOutputModel,
    description: 'Created successfully',
  })
  async createQuestion(
    @Body() quizQuestionInputModel: QuestionInputModel,
  ): Promise<QuestionOutputModel> {
    const createQuizQuestionCommand = new CreateQuizQuestionCommand(
      quizQuestionInputModel,
    );

    const dbQuizQuestion: Question = await this.commandBus.execute(
      createQuizQuestionCommand,
    );

    return QuestionOutputModelMapper(dbQuizQuestion);
  }

  @Delete('questions/:questionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminAuthGuard)
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiBadRequestResponse({ description: 'Bad uuid for questionId' })
  async deleteQuestion(@Param('questionId', ParseUUIDPipe) questionId: string) {
    const question = await Question.findOne({
      where: { id: questionId, isActive: true },
      relations: {
        answers: true,
      },
    });

    if (!question) {
      throw new NotFoundException();
    }

    const deletedAnswers: Answer[] = question.answers.map((a) =>
      Answer.create({
        ...a,
        isActive: false,
      }),
    );

    question.isActive = false;
    question.answers = deletedAnswers;
    await question.save();
  }

  @Delete('questions')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminAuthGuard)
  @ApiNotFoundResponse({ description: 'At least one id was not found' })
  @ApiBadRequestResponse({
    description: 'At least one entity has wrong format id',
  })
  async deleteQuestions(@Query('ids') questionIds: string) {
    const idsArray = getAndValidateIds(questionIds);

    const questions = await Question.find({
      where: { id: In(idsArray), isActive: true },
      relations: { answers: true },
    });

    if (questions.length !== idsArray.length) {
      throw new BadRequestException('Some questions were not found.');
    }

    await this.dataSource.transaction(async (entityManager) => {
      const deletedQuestions = questions.map((question) => ({
        ...question,
        isActive: false,
        answers: question.answers.map((a) => ({ ...a, isActive: false })),
      }));

      await entityManager.save(Question, deletedQuestions);
    });
  }

  @Put('questions/:questionId')
  @UseGuards(AdminAuthGuard)
  @ApiDefaultNotFoundResponse()
  @ApiBadRequestResponse({ description: 'Bad uuid for questionId' })
  @ApiOkResponse({ type: QuestionOutputModel })
  async updateQuestion(
    @Body() quizQuestionInputModel: QuestionInputModel,
    @Param('questionId', ParseUUIDPipe) questionId: string,
  ) {
    const question = await Question.findOne({
      where: { id: questionId, isActive: true },
      relations: { answers: true },
    });

    if (!question) {
      throw new NotFoundException();
    }

    const { body, correctAnswers } = quizQuestionInputModel;

    await Answer.delete({ question: { id: questionId } });

    const newAnswers = correctAnswers.map((answer) => {
      return Answer.create({ content: answer });
    });

    question.answers = newAnswers;
    question.body = body;
    await question.save();

    return QuestionOutputModelMapper(question);
  }

  @Put('questions/:questionId/publish')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminAuthGuard)
  @ApiDefaultNoContentResponse()
  @ApiDefaultNotFoundResponse()
  @ApiBadRequestResponse({ description: 'Bad uuid for questionId' })
  async changeQuestionPublishing(
    @Body() updateQuestionPublishStatusModel: UpdateQuestionPublishStatusModel,
    @Param('questionId', ParseUUIDPipe) questionId: string,
  ) {
    const question = await Question.findOne({
      where: { id: questionId, isActive: true },
      relations: { answers: true },
    });

    if (!question) {
      throw new NotFoundException();
    }

    const { published } = updateQuestionPublishStatusModel;

    question.published = published;

    await question.save();
  }
}
