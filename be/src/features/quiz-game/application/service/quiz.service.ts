import { Injectable } from '@nestjs/common';
import { PlayerGameResult } from '../../domain/PlayerGameProgress';
import { QuizGame } from '../../domain/QuizGame';

@Injectable()
export class QuizService {
  calculateGameResultForPlayer(
    game: QuizGame,
    userId: string,
  ): PlayerGameResult {
    if (!game.playersProgress.some((pp) => pp.playerAccount.id === userId)) {
      throw new Error('User does not belong to the game');
    }

    const userPlayerProgress = game.playersProgress.find(
      (pp) => pp.playerAccount.id === userId,
    );

    const opponentPlayerProgress = game.playersProgress.find(
      (pp) => pp.playerAccount.id !== userId,
    );

    if (!opponentPlayerProgress || !userPlayerProgress) {
      throw new Error('No 2 players were found');
    }

    if (userPlayerProgress.points === opponentPlayerProgress.points) {
      return PlayerGameResult.Draw;
    }

    if (userPlayerProgress.points > opponentPlayerProgress.points) {
      return PlayerGameResult.Win;
    }

    return PlayerGameResult.Loose;
  }
}
