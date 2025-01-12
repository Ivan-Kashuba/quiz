import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Trim } from '../../../../infrastructure/decorators/transform/trim';

import { DataSource, Raw } from 'typeorm';
import { QuizGame } from '../../domain/QuizGame';
import { ForbiddenException } from '@nestjs/common';
import { PlayerProgress } from '../../domain/PlayerGameProgress';
import { GameAnswer } from '../../domain/GameAnswer';

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
  constructor(private dataSource: DataSource) {}

  async execute(command: AnswerNextQuizQuestionCommand): Promise<void> {
    await validateOrReject(command);

    const { userId, answer } = command;

    const currentGame = await QuizGame.findOne({
      where: {
        playersProgress: { isActive: true, playerAccount: { id: userId } },
        finishGameDate: null,
        pairCreatedDate: Raw((alias) => `${alias} IS NOT NULL`),
      },
      relations: {
        gameQuestions: { question: { answers: true }, gameAnswer: true },
        playersProgress: { playerAccount: true },
      },
    });

    if (!currentGame) throw new ForbiddenException('There is no current game!');

    const userGameProgress = await PlayerProgress.findOne({
      where: {
        playerAccount: { id: userId, isActive: true },
        gameId: currentGame.id,
      },
      relations: { playerAccount: true, gameAnswers: true },
    });

    const currentQuestionNumber = userGameProgress?.gameAnswers?.length;

    if (currentQuestionNumber > 4)
      throw new ForbiddenException('No questions left');

    let answerId = null;

    await this.dataSource.transaction(async (entityManager) => {
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

      await entityManager.save(newAnswer);

      answerId = newAnswer.id;
    });

    return answerId;
  }
}
