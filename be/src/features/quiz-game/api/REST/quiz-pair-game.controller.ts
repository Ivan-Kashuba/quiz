import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiDefaultBadRequestResponse,
  ApiDefaultNotFoundResponse,
  ApiDefaultUnauthorizedResponse,
} from '../../../../infrastructure/decorators/swagger/default-responses';
import { GameOutputModel } from '../models/output/game.output.model';
import { UserAuthGuard } from '../../../../infrastructure/guards/user-auth.guard';
import { ConnectToQuizCommand } from '../../application/use-cases/connect-to-the-quiz-game.handler';
import { UserTokenInfo } from '../../../../infrastructure/decorators/transform/user-token-info';
import { QuizGameQueryRepository } from '../../infrastructure/quiz-game.query.repository';
import { QuestionGameAnswerInputModel } from '../models/input/question-answer.input.model';
import { AnswerNextQuizQuestionCommand } from '../../application/use-cases/answer-next-quiz-question.handler';
import { GameAnswerOutputModel } from '../models/output/game-answer.output.model';

import { PaginationOutputModel } from '../../../../infrastructure/pagination/models/output/pagination.output.model';
import { PaginationInputModel } from '../../../../infrastructure/pagination/models/input/pagination.input.model';
import { UserStatisticOutputModel } from '../models/output/user-statistic.output.model';
import { TopGamePlayerOutputModel } from '../models/output/top-game-player.output.model';
import { ApiPaginatedResponse } from '../../../../infrastructure/pagination/decorators/api-paginated-response/ApiPaginatedResponse ';

@ApiTags('Quiz Pair Game')
@Controller('pair-game-quiz')
export class QuizPairGameController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly quizGameQueryRepository: QuizGameQueryRepository,
  ) {}

  @Get('pairs/my-current')
  @UseGuards(UserAuthGuard)
  @ApiDefaultUnauthorizedResponse()
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
  @UseGuards(UserAuthGuard)
  @ApiDefaultUnauthorizedResponse()
  @ApiOkResponse({ type: GameOutputModel })
  @ApiNotFoundResponse({ description: 'The list of questions is empty' })
  @ApiForbiddenResponse({
    description: 'If current user is already participating in active pair',
  })
  async connectToTheGame(
    @UserTokenInfo('userId') userId: string,
  ): Promise<GameOutputModel> {
    const connectToQuizCommand = new ConnectToQuizCommand({
      userId,
    });

    const gameId = await this.commandBus.execute(connectToQuizCommand);

    return await this.quizGameQueryRepository.findQuizGameById(gameId);
  }

  @Get('pairs/my')
  @UseGuards(UserAuthGuard)
  @ApiDefaultUnauthorizedResponse()
  @ApiPaginatedResponse(GameOutputModel)
  async getUserGames(
    @UserTokenInfo('userId') userId: string,
    @Query() paginationInputModel: PaginationInputModel,
  ): Promise<PaginationOutputModel<GameOutputModel>> {
    return await this.quizGameQueryRepository.findGamesByUserId(
      userId,
      paginationInputModel,
    );
  }

  @Get('pairs/:gameId')
  @UseGuards(UserAuthGuard)
  @ApiDefaultUnauthorizedResponse()
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
  @UseGuards(UserAuthGuard)
  @ApiDefaultUnauthorizedResponse()
  @ApiOkResponse({ type: GameAnswerOutputModel })
  @ApiForbiddenResponse({
    description: 'No active game or next question',
  })
  @ApiDefaultBadRequestResponse()
  async answerOnNextGameQuestion(
    @UserTokenInfo('userId') userId: string,
    @Body() body: QuestionGameAnswerInputModel,
  ): Promise<GameAnswerOutputModel> {
    const answerOnNextGameQuestionCommand = new AnswerNextQuizQuestionCommand({
      userId,
      answer: body.answer,
    });

    const answerId = await this.commandBus.execute(
      answerOnNextGameQuestionCommand,
    );

    return this.quizGameQueryRepository.findGameAnswerById(answerId);
  }

  @Get('pairs/users/my-statistic')
  @UseGuards(UserAuthGuard)
  @ApiDefaultUnauthorizedResponse()
  @ApiOkResponse({ type: UserStatisticOutputModel })
  async getUserStatistic(
    @UserTokenInfo('userId') userId: string,
  ): Promise<UserStatisticOutputModel> {
    return this.quizGameQueryRepository.findUserStatisticByUserId(userId);
  }

  @Get('users/top')
  @ApiPaginatedResponse(TopGamePlayerOutputModel)
  async getTopUsersStatistic(
    @Query() paginationInputModel: PaginationInputModel,
  ): Promise<PaginationOutputModel<TopGamePlayerOutputModel>> {
    return await this.quizGameQueryRepository.findTopUsersStatistic(
      paginationInputModel,
    );
  }
}
