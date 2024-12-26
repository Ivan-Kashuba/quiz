import { ApiProperty } from '@nestjs/swagger';
import { GameQuestion } from '../../../domain/GameQuestion';

export class GameQuestionOutputModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  body: string;
}

export const GameQuestionOutputModelMapper = (
  dbGameQuestion: GameQuestion,
): GameQuestionOutputModel => {
  return { id: dbGameQuestion.id, body: dbGameQuestion.body };
};
