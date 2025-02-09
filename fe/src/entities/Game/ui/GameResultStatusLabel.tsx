import { PlayerGameResult } from '@/entities/TopGamePlayers/types/player.ts';
import clx from 'classnames';

export const GameResultStatusLabel = ({
  gameResult,
}: {
  gameResult: PlayerGameResult;
}) => {
  const resultStatusToText = {
    [PlayerGameResult.Unfinished]: 'Unfinished',
    [PlayerGameResult.Win]: 'Win',
    [PlayerGameResult.Draw]: 'Draw',
    [PlayerGameResult.Loose]: 'Loose',
  };

  const resultStatusToStyle = {
    [PlayerGameResult.Unfinished]: 'bg-gray-500/20 text-gray-400 animate-pulse',
    [PlayerGameResult.Win]: 'bg-green-500/20 text-green-400',
    [PlayerGameResult.Draw]: 'bg-amber-500/20 text-amber-400',
    [PlayerGameResult.Loose]: 'bg-red-500/20 text-red-400',
  };

  return (
    <span className={clx(`px-2 py-1 rounded`, resultStatusToStyle[gameResult])}>
      {resultStatusToText[gameResult]}
    </span>
  );
};
