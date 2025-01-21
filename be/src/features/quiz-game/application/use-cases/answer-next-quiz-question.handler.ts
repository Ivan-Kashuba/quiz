import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Trim } from '../../../../infrastructure/decorators/transform/trim';

import { DataSource, Not, Raw } from 'typeorm';
import { QuizGame } from '../../domain/QuizGame';
import { ForbiddenException } from '@nestjs/common';
import { PlayerProgress } from '../../domain/PlayerGameProgress';
import { GameAnswer } from '../../domain/GameAnswer';
import { QuizService } from './quiz.service';

export class AnswerNextQuizQuestionCommand {
  @Trim()
  @IsNotEmpty()
  userId: string;

  @Trim()
  @IsNotEmpty()
  answer: string;

  constructor(data: AnswerNextQuizQuestionCommand) {
    Object.assign(this, plainToClass(AnswerNextQuizQuestionCommand, data));
  }
}

@CommandHandler(AnswerNextQuizQuestionCommand)
export class AnswerNextQuizQuestionHandler
  implements ICommandHandler<AnswerNextQuizQuestionCommand>
{
  constructor(
    private dataSource: DataSource,
    private quizService: QuizService,
  ) {}

  async execute(command: AnswerNextQuizQuestionCommand): Promise<void> {
    await validateOrReject(command);

    const { userId, answer } = command;

    let answerId = null;

    await this.dataSource.transaction(async (entityManager) => {
      const currentGame = await entityManager.getRepository(QuizGame).findOne({
        where: {
          isActive: true,
          playersProgress: { isActive: true, playerAccount: { id: userId } },
          finishGameDate: null,
          pairCreatedDate: Raw((alias) => `${alias} IS NOT NULL`),
        },
        relations: {
          gameQuestions: { question: { answers: true }, gameAnswers: true },
          playersProgress: { playerAccount: true },
        },
      });

      if (!currentGame)
        throw new ForbiddenException('There is no current game!');

      const userGameProgress = await entityManager
        .getRepository(PlayerProgress)
        .findOne({
          where: {
            playerAccount: { id: userId, isActive: true },
            gameId: currentGame.id,
          },
          relations: { playerAccount: true, gameAnswers: true },
        });

      const opponentGameProgress = await entityManager
        .getRepository(PlayerProgress)
        .findOne({
          where: {
            playerAccount: { id: Not(userId), isActive: true },
            gameId: currentGame.id,
          },
          relations: { playerAccount: true, gameAnswers: true },
        });

      const currentQuestionNumber = userGameProgress?.gameAnswers?.length;

      if (currentQuestionNumber > 4) {
        throw new ForbiddenException('No questions left');
      }

      const currentGameQuestion =
        currentGame.gameQuestions[currentQuestionNumber];

      const newAnswer = entityManager.getRepository(GameAnswer).create({
        isCorrect: currentGameQuestion.question.answers
          .map((answ) => answ.content)
          .includes(answer),
        gameQuestion: { id: currentGameQuestion.id },
        body: answer,
        playerProgress: { id: userGameProgress.id },
      });

      if (newAnswer.isCorrect) {
        userGameProgress.points = userGameProgress.points + 1;
      }

      // Need to make it to keep userGameProgress up-to-date
      userGameProgress.gameAnswers = [
        ...userGameProgress.gameAnswers,
        newAnswer,
      ];

      await entityManager.save(newAnswer);
      await entityManager.save(userGameProgress);

      answerId = newAnswer.id;

      const gameAnswers = await entityManager.getRepository(GameAnswer).find();

      if (gameAnswers.length === 10) {
        const game = await entityManager.getRepository(QuizGame).findOne({
          where: {
            id: currentGame.id,
          },
          relations: {
            gameQuestions: { question: { answers: true }, gameAnswers: true },
            playersProgress: { playerAccount: true },
          },
        });

        const userGameResult = this.quizService.calculateGameResultForPlayer(
          game,
          userId,
        );

        userGameProgress.gameResult = userGameResult;
        await entityManager.save(userGameProgress);

        const opponentGameResult =
          this.quizService.calculateGameResultForPlayer(
            game,
            opponentGameProgress.playerAccount.id,
          );

        opponentGameProgress.gameResult = opponentGameResult;
        await entityManager.save(opponentGameProgress);

        game.finishGameDate = new Date();
        await entityManager.save(game);
      }
    });

    return answerId;
  }
}
