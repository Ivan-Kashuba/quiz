import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiDefaultBadRequestResponse,
  ApiDefaultNotFoundResponse,
  ApiDefaultUnauthorizedResponse,
} from '../../../infrastructure/decorators/swagger/default-responses';
import { GameOutputModel } from './models/output/game.output.model';
import { UserAuthGuard } from '../../../infrastructure/guards/user-auth.guard';
import { ConnectToQuizCommand } from '../application/use-cases/connect-to-the-quiz-game.handler';
import { UserTokenInfo } from '../../../infrastructure/decorators/transform/user-token-info';
import { QuizGameQueryRepository } from '../infrastructure/quiz-game.query.repository';
import { QuestionAnswerOutputModel } from './models/output/question-answer.output.model';
import { QuestionGameAnswerInputModel } from './models/input/question-answer.input.model';
import { AnswerStatus } from '../domain/enums/AnswerStatus';
import { AnswerNextQuizQuestionCommand } from '../application/use-cases/answer-next-quiz-question.handler';

@ApiDefaultUnauthorizedResponse()
@ApiTags('Quiz Pair Game')
@UseGuards(UserAuthGuard)
@Controller('pair-game-quiz')
export class QuizPairGameController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly quizGameQueryRepository: QuizGameQueryRepository,
  ) {}

  @Get('pairs/my-current')
  @ApiDefaultNotFoundResponse()
  @ApiOkResponse({ type: GameOutputModel })
  async getCurrentGame(
    @UserTokenInfo('userId') userId: string,
  ): Promise<GameOutputModel> {
    const currentGame =
      await this.quizGameQueryRepository.getCurrentUserGame(userId);

    if (!currentGame) throw new NotFoundException();

    return currentGame;
  }

  @Post('pairs/connection')
  @ApiOkResponse({ type: GameOutputModel })
  @ApiNotFoundResponse({ description: 'The list of questions is empty' })
  @ApiForbiddenResponse({
    description: 'If current user is already participating in active pair',
  })
  async connectToTheGame(
    @UserTokenInfo('userId') userId: string,
  ): Promise<GameOutputModel> {
    const createQuizQuestionCommand = new ConnectToQuizCommand({
      userId,
    });

    const gameId = await this.commandBus.execute(createQuizQuestionCommand);

    return await this.quizGameQueryRepository.findQuizGameById(gameId);
  }

  @Get('pairs/:gameId')
  @ApiOkResponse({ type: GameOutputModel })
  @ApiNotFoundResponse({ description: 'No game by id' })
  @ApiBadRequestResponse({ description: 'Bad uuid for questionId' })
  @ApiForbiddenResponse({
    description: 'If user was not participated in the game',
  })
  async getQuizGameById(
    @Param('gameId', ParseUUIDPipe) gameId: string,
    @UserTokenInfo('userId') userId: string,
  ): Promise<GameOutputModel> {
    const game = await this.quizGameQueryRepository.findQuizGameById(gameId);

    if (!game) throw new NotFoundException();

    const isOwnGame = [
      game?.firstPlayerProgress?.player?.id,
      game?.secondPlayerProgress?.player?.id,
    ].includes(userId);

    if (!isOwnGame) throw new ForbiddenException();

    return game;
  }

  @Post('pairs/my-current/answers')
  @ApiOkResponse({ type: QuestionAnswerOutputModel })
  @ApiForbiddenResponse({
    description: 'No active game or next question',
  })
  @ApiDefaultBadRequestResponse()
  async answerOnNextGameQuestion(
    @UserTokenInfo('userId') userId: string,
    @Body() body: QuestionGameAnswerInputModel,
  ): Promise<QuestionAnswerOutputModel> {
    const answerOnNextGameQuestionCommand = new AnswerNextQuizQuestionCommand({
      userId,
      answer: body.answer,
    });
    await this.commandBus.execute(answerOnNextGameQuestionCommand);

    return {
      questionId: '123',
      answerStatus: AnswerStatus.Correct,
      addedAt: new Date().toISOString(),
    };
  }
}
