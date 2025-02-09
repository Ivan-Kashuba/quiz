import { TGame } from '@/entities/Game/types/game.ts';

export const getGameResultString = (game: TGame) => {
  const { firstPlayerProgress, secondPlayerProgress } = game;

  const sortedByPointsProgresses = [
    firstPlayerProgress,
    secondPlayerProgress,
  ].sort((a, b) => b.score - a.score);

  if (sortedByPointsProgresses[0].score === sortedByPointsProgresses[1].score) {
    return 'Draw';
  }

  return `The winner is ${sortedByPointsProgresses[0].player.username}`;
};
