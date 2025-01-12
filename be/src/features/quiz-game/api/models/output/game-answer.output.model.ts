import { ApiProperty } from '@nestjs/swagger';
import { AnswerStatus } from '../../../domain/enums/AnswerStatus';
import { GameAnswer } from '../../../domain/GameAnswer';

export class GameAnswerOutputModel {
  @ApiProperty()
  questionId: string;

  @ApiProperty()
  answerStatus: AnswerStatus;

  @ApiProperty()
  addedAt: Date;
}

export const mapGameAnswerOutputModel = (
  dbGameAnswer: GameAnswer,
): GameAnswerOutputModel => {
  return {
    addedAt: dbGameAnswer.createdAt,
    answerStatus: dbGameAnswer.isCorrect
      ? AnswerStatus.Correct
      : AnswerStatus.Incorrect,
    questionId: dbGameAnswer.gameQuestion?.id,
  };
};
