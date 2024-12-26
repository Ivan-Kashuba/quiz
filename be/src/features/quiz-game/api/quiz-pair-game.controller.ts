import {
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CommandBus } from '@nestjs/cqrs';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiDefaultNotFoundResponse,
  ApiDefaultUnauthorizedResponse,
} from '../../../infrastructure/decorators/swagger/default-responses';
import { GameOutputModel } from './models/output/game.output.model';
import { UserAuthGuard } from '../../../infrastructure/guards/user-auth.guard';
import { ConnectToQuizCommand } from '../application/use-cases/connect-to-the-quiz-game.handler';
import { UserTokenInfo } from '../../../infrastructure/decorators/transform/user-token-info';
import { QuizGameQueryRepository } from '../infrastructure/quiz-game.query.repository';

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
}
