import {
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
import { QuizQueryRepository } from '../infrastructure/quiz-query.repository';
import { QuestionInputModel } from './models/input/create-question.input.model';
import { CreateQuizQuestionCommand } from '../application/use-cases/create-quiz-question.handler';
import { Question } from '../domain/Question';
import { Answer } from '../domain/Answer';
import { UpdateQuestionPublishStatusModel } from './models/input/update-question-publish-status.input.model';
import { isUUID } from 'class-validator';
import { PaginationInputModel } from '../../../infrastructure/pagination/models/input/pagination.input.model';
import { AdminAuthGuard } from '../../../infrastructure/guards/admin-auth.guard';
import { PaginationOutputModel } from '../../../infrastructure/pagination/models/output/pagination.output.model';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../infrastructure/pagination/decorators/api-paginated-response/ApiPaginatedResponse ';
import {
  ApiDefaultNoContentResponse,
  ApiDefaultNotFoundResponse,
  ApiDefaultUnauthorizedResponse,
} from '../../../infrastructure/decorators/swagger/default-responses';

@ApiSecurity('basic')
@ApiDefaultUnauthorizedResponse()
@ApiTags('Questions management')
@Controller('sa')
export class QuestionsController {
  constructor(
    private readonly quizQueryRepository: QuizQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('questions')
  @UseGuards(AdminAuthGuard)
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
    const publishedStatus = queryParams?.publishedStatus || null;

    return await this.quizQueryRepository.findQuestions(
      bodySearchTerm,
      publishedStatus,
      paginationInputModel,
    );
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
  async deleteQuestion(@Param('questionId') questionId: string) {
    if (!isUUID(questionId)) {
      throw new NotFoundException();
    }

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
