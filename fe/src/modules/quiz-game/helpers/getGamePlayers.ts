import { TGame, TPlayerProgress } from '@/entities/Game/types/game.ts';

export const getGameRolesByPlayerId = (
  game: TGame,
  playerId: string
): { player: TPlayerProgress; opponent: TPlayerProgress | null } => {
  const { firstPlayerProgress, secondPlayerProgress } = game;

  const participants = [firstPlayerProgress, secondPlayerProgress];

  const player = participants.find((p) => p.player.id === playerId);

  if (!player) {
    throw new Error('Player not found in this game');
  }

  const opponent = participants.find((p) => p?.player?.id !== playerId);

  return { player, opponent: opponent || null };
};
