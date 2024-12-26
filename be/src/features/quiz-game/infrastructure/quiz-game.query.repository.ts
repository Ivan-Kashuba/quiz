import { Injectable } from '@nestjs/common';
import {
  GameOutputModel,
  GameOutputModelMapper,
} from '../api/models/output/game.output.model';
import { QuizGame } from '../domain/QuizGame';

@Injectable()
export class QuizGameQueryRepository {
  async getCurrentUserGame(userId: string): Promise<GameOutputModel> {
    const currentGame = await QuizGame.createQueryBuilder('quizGame')
      .leftJoinAndSelect('quizGame.gameQuestions', 'gameQuestions')
      .leftJoinAndSelect('quizGame.playersProgress', 'playersProgress')
      .leftJoinAndSelect('playersProgress.playerAccount', 'playerAccount')
      .leftJoinAndSelect('playersProgress.gameAnswers', 'gameAnswers')
      .where('playersProgress.isActive = :isActive', { isActive: true })
      .andWhere('playerAccount.id = :userId', { userId })
      .andWhere('quizGame.finishGameDate IS NULL')
      .getOne();

    return GameOutputModelMapper(currentGame);
  }

  async findQuizGameById(quizGameId: string): Promise<GameOutputModel> {
    if (!quizGameId) throw new Error('No gameId');

    const dbGame = await QuizGame.findOne({
      where: { id: quizGameId, isActive: true },
      relations: {
        playersProgress: { playerAccount: true, gameAnswers: true },
        gameQuestions: true,
      },
    });

    return GameOutputModelMapper(dbGame);
  }
}
