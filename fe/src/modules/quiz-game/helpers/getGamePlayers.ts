import { TGame, TPlayerProgress } from '@/entities/Game/types/game.ts';

export const getGameRolesByPlayerId = (
  game: TGame,
  playerId: string
): { player: TPlayerProgress; opponent: TPlayerProgress } => {
  const { firstPlayerProgress, secondPlayerProgress } = game;

  const participants = [firstPlayerProgress, secondPlayerProgress];

  const player = participants.find((p) => p.player.id === playerId);

  if (!player) {
    throw new Error('Player not found in this game');
  }

  const opponent = participants.find((p) => p.player.id !== playerId);

  if (!opponent) {
    throw new Error('Another player was not found in this game');
  }

  return { player, opponent };
};
