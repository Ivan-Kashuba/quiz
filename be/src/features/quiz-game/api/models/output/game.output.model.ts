import { ApiProperty } from '@nestjs/swagger';
import {
  PlayerProgressOutputModel,
  PlayerProgressOutputModelMapper,
} from './player-progress.output.model';
import {
  GameQuestionOutputModel,
  GameQuestionOutputModelMapper,
} from './game-question.output.model';
import { GameStatus } from '../../../domain/enums/GameStatus';
import { QuizGame } from '../../../domain/QuizGame';

export class GameOutputModel {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: PlayerProgressOutputModel })
  firstPlayerProgress: PlayerProgressOutputModel;

  @ApiProperty({ type: PlayerProgressOutputModel })
  secondPlayerProgress: PlayerProgressOutputModel;

  @ApiProperty({ isArray: true, type: [GameQuestionOutputModel] })
  questions: GameQuestionOutputModel[];

  @ApiProperty({ enum: GameStatus })
  status: GameStatus;

  @ApiProperty()
  pairCreatedDate: Date;

  @ApiProperty()
  startGameDate: Date;

  @ApiProperty()
  finishGameDate: Date;
}

export const getViewGameStatus = (dbGame: QuizGame): GameStatus => {
  if (dbGame.pairCreatedDate && !dbGame.finishGameDate) {
    return GameStatus.Active;
  }

  if (!dbGame.finishGameDate && !dbGame.pairCreatedDate) {
    return GameStatus.PendingSecondPlayer;
  }

  if (dbGame.finishGameDate) {
    return GameStatus.Finished;
  }
};

export const GameOutputModelMapper = (dbGame: QuizGame) => {
  return {
    id: dbGame.id,
    firstPlayerProgress: PlayerProgressOutputModelMapper(
      dbGame.playersProgress[0],
    ),
    secondPlayerProgress: PlayerProgressOutputModelMapper(
      dbGame.playersProgress[1],
    ),
    questions: dbGame.gameQuestions.map(GameQuestionOutputModelMapper),
    status: getViewGameStatus(dbGame),
    startGameDate: dbGame.startGameDate,
    pairCreatedDate: dbGame.pairCreatedDate,
    finishGameDate: dbGame.finishGameDate,
  };
};
