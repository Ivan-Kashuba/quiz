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
import { PaginationOutputModel } from '../../../infrastructure/pagination/models/output/pagination.output.model';
import { PaginationInputModel } from '../../../infrastructure/pagination/models/input/pagination.input.model';
import { TypeOrmHelper } from '../../../infrastructure/helpers/typeorm/typeorm-helper';
import { UserStatisticOutputModel } from '../api/models/output/user-statistic.output.model';
import { PlayerGameResult, PlayerProgress } from '../domain/PlayerGameProgress';

@Injectable()
export class QuizGameQueryRepository {
  constructor(private readonly typeOrmHelper: TypeOrmHelper) {}

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

  async findUserStatisticByUserId(
    userId: string,
  ): Promise<UserStatisticOutputModel> {
    const { gamesCount, winsCount, lossesCount, drawsCount, totalPoints } =
      await PlayerProgress.createQueryBuilder('playerProgress')
        .select('COUNT(*)', 'gamesCount')
        .addSelect(
          `SUM(CASE WHEN playerProgress.gameResult = :win THEN 1 ELSE 0 END)`,
          'winsCount',
        )
        .addSelect(
          `SUM(CASE WHEN playerProgress.gameResult = :loose THEN 1 ELSE 0 END)`,
          'lossesCount',
        )
        .addSelect(
          `SUM(CASE WHEN playerProgress.gameResult = :draw THEN 1 ELSE 0 END)`,
          'drawsCount',
        )
        .addSelect(`SUM(playerProgress.points)`, 'totalPoints')
        .where('playerProgress.playerAccount = :userId', { userId })
        .setParameters({
          win: PlayerGameResult.Win,
          loose: PlayerGameResult.Loose,
          draw: PlayerGameResult.Draw,
        })
        .getRawOne();

    return {
      gamesCount: +gamesCount,
      drawsCount: +drawsCount,
      lossesCount: +lossesCount,
      winsCount: +winsCount,
      sumScore: +totalPoints,
      avgScores:
        Math.round((totalPoints / gamesCount + Number.EPSILON) * 100) / 100,
    };
  }

  async findGamesByUserId(
    userId: string,
    pagination: PaginationInputModel,
  ): Promise<PaginationOutputModel<GameOutputModel>> {
    if (!userId) throw new Error('No userId');

    const { order, skip, limit } = pagination;

    const validatedOrderBy = this.typeOrmHelper.validateFieldInEntity(
      QuizGame,
      pagination.orderBy,
    );

    const [dbGames, total] = await QuizGame.createQueryBuilder('quizGame')
      .leftJoinAndSelect('quizGame.gameQuestions', 'gameQuestions')
      .leftJoinAndSelect('quizGame.playersProgress', 'playersProgress')
      .leftJoinAndSelect('playersProgress.playerAccount', 'playerAccount')
      .leftJoinAndSelect('playersProgress.gameAnswers', 'gameAnswers')
      .leftJoinAndSelect('gameAnswers.gameQuestion', 'gameQuestion')
      .where('quizGame.isActive = :isActive', { isActive: true })
      .orderBy(`quizGame.${validatedOrderBy || 'createdAt'}`, order)
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    const viewModelGames: GameOutputModel[] = dbGames.map(
      GameOutputModelMapper,
    );

    return new PaginationOutputModel(viewModelGames, total, pagination);
  }
}
