import { Injectable } from '@nestjs/common';
import {
  GameOutputModel,
  GameOutputModelMapper,
} from '../api/models/output/game.output.model';
import { QuizGame } from '../domain/QuizGame';
import {
  GameAnswerOutputModel,
  mapGameAnswerOutputModel,
} from '../api/models/output/game-answer.output.model';
import { GameAnswer } from '../domain/GameAnswer';

@Injectable()
export class QuizGameQueryRepository {
  async getCurrentUserGame(userId: string): Promise<GameOutputModel> {
    const currentGame = await QuizGame.createQueryBuilder('quizGame')
      .leftJoinAndSelect('quizGame.gameQuestions', 'gameQuestions')
      .leftJoinAndSelect('quizGame.playersProgress', 'playersProgress')
      .leftJoinAndSelect('playersProgress.playerAccount', 'playerAccount')
      .leftJoinAndSelect('playersProgress.gameAnswers', 'gameAnswers')
      .leftJoinAndSelect('gameAnswers.gameQuestion', 'gameQuestion')
      .where('playersProgress.isActive = :isActive', { isActive: true })
      .andWhere('playerAccount.id = :userId', { userId })
      .andWhere('quizGame.finishGameDate IS NULL')
      .getOne();

    return GameOutputModelMapper(currentGame);
  }

  async findQuizGameById(quizGameId: string): Promise<GameOutputModel | null> {
    if (!quizGameId) throw new Error('No gameId');

    const dbGame = await QuizGame.findOne({
      where: { id: quizGameId, isActive: true },
      relations: {
        playersProgress: {
          playerAccount: true,
          gameAnswers: { gameQuestion: true },
        },
        gameQuestions: true,
      },
    });

    if (!dbGame) return null;

    return GameOutputModelMapper(dbGame);
  }
  async findGameAnswerById(
    answerId: string,
  ): Promise<GameAnswerOutputModel | null> {
    if (!answerId) throw new Error('No answerId');

    const dbGame = await GameAnswer.findOne({
      where: { id: answerId, isActive: true },
      relations: {
        gameQuestion: true,
      },
    });

    if (!dbGame) return null;

    return mapGameAnswerOutputModel(dbGame);
  }
}
