import { PlayerOutputModel } from './player.output.model';
import {
  GameAnswerOutputModel,
  mapGameAnswerOutputModel,
} from './game-answer.output.model';
import { ApiProperty } from '@nestjs/swagger';
import { PlayerProgress } from '../../../domain/PlayerGameProgress';

export class PlayerProgressOutputModel {
  @ApiProperty()
  answers: GameAnswerOutputModel[];
  @ApiProperty()
  player: PlayerOutputModel;
  @ApiProperty()
  score: number;
}

export const PlayerProgressOutputModelMapper = (
  dbPlayerProgress?: PlayerProgress,
): PlayerProgressOutputModel | null => {
  if (!dbPlayerProgress) return null;

  return {
    player: {
      id: dbPlayerProgress.playerAccount.id,
      username: dbPlayerProgress.playerAccount.username,
    },
    answers: dbPlayerProgress.gameAnswers.map(mapGameAnswerOutputModel),
    score: dbPlayerProgress.gameAnswers.filter((answer) => answer.isCorrect)
      .length,
  };
};
