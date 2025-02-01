import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Trim } from '../../../../infrastructure/decorators/transform/trim';

import { DataSource, IsNull } from 'typeorm';
import { QuizGame } from '../../domain/QuizGame';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PlayerProgress } from '../../domain/PlayerGameProgress';
import { Question } from '../../../questions/domain/Question';
import { GameQuestion } from '../../domain/GameQuestion';

export class ConnectToQuizCommand {
  @Trim()
  @IsNotEmpty()
  userId: string;

  constructor(data: ConnectToQuizCommand) {
    Object.assign(this, plainToClass(ConnectToQuizCommand, data));
  }
}

@CommandHandler(ConnectToQuizCommand)
export class ConnectToQuizHandler
  implements ICommandHandler<ConnectToQuizCommand>
{
  constructor(private dataSource: DataSource) {}

  async execute(command: ConnectToQuizCommand): Promise<string> {
    await validateOrReject(command);

    const { userId } = command;

    const isAlreadyParticipateInGame = await QuizGame.createQueryBuilder(
      'quizGame',
    )
      .leftJoinAndSelect('quizGame.playersProgress', 'playersProgress')
      .leftJoinAndSelect('playersProgress.playerAccount', 'playerAccount')
      .where('playersProgress.isActive = :isActive', { isActive: true })
      .andWhere('playerAccount.id = :userId', { userId })
      .andWhere('quizGame.finishGameDate IS NULL')
      .getOne();

    if (isAlreadyParticipateInGame) {
      throw new ForbiddenException('Already participate in');
    }

    const currentlyAwaitingConnectionGame = await QuizGame.findOne({
      where: {
        isActive: true,
        pairCreatedDate: IsNull(),
        finishGameDate: IsNull(),
      },
      relations: { playersProgress: true },
    });

    if (currentlyAwaitingConnectionGame) {
      await this.dataSource.transaction(async (entityManager) => {
        const gameInTransaction = await entityManager
          .getRepository(QuizGame)
          .findOne({ where: { id: currentlyAwaitingConnectionGame.id } });

        const newUserProgress = entityManager.create(PlayerProgress, {
          playerAccount: { id: userId },
          gameId: currentlyAwaitingConnectionGame.id,
        });

        await entityManager.save(newUserProgress);

        gameInTransaction.pairCreatedDate = new Date();
        await entityManager.save(gameInTransaction);
      });

      return currentlyAwaitingConnectionGame.id;
    }

    if (!currentlyAwaitingConnectionGame) {
      console.log('NO GAME');
      let newGameId = null;
      await this.dataSource.transaction(async (entityManager) => {
        const randomQuestionsForQuiz = await entityManager
          .createQueryBuilder(Question, 'q')
          .where('q.published = :published AND q.isActive = :isActive', {
            published: true,
            isActive: true,
          })
          .orderBy('RANDOM()')
          .take(5)
          .getMany();

        if (randomQuestionsForQuiz.length === 0) {
          throw new NotFoundException('There is no questions in the list');
        }

        const newGame = QuizGame.create({
          playersProgress: [],
        });
        await entityManager.save(newGame);

        const gameQuestions = randomQuestionsForQuiz.map((q) => {
          return GameQuestion.create({
            body: q.body,
            questionId: q.id,
            quizGame: newGame,
          });
        });

        await entityManager.save(gameQuestions);

        newGame.gameQuestions = gameQuestions;
        await entityManager.save(newGame);

        newGameId = newGame.id;

        const newUserProgress = PlayerProgress.create({
          playerAccount: { id: userId },
          game: { id: newGame.id },
        });

        await entityManager.save(newUserProgress);
      });

      return newGameId;
    }
  }
}
