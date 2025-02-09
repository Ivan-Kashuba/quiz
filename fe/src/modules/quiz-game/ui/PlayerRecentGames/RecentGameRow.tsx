import { TGame } from '@/entities/Game/types/game.ts';
import { usePlayerConsumer } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';
import { getGameRolesByPlayerId } from '@/modules/quiz-game/helpers/getGamePlayers.ts';
import { TableCell, TableRow } from '@/ui/table.tsx';
import { GameResultStatusLabel } from '@/entities/Game/ui/GameResultStatusLabel.tsx';
import { useNavigate } from 'react-router-dom';
import { getViewDateTime } from '@/shared/lib/date/date-display-format.ts';

export const RecentGameRow = ({ game }: { game: TGame }) => {
  const navigate = useNavigate();
  const { currentPlayer } = usePlayerConsumer();

  const { player, opponent } = getGameRolesByPlayerId(game, currentPlayer!.id);

  const onNavigateToTheGame = () => {
    navigate(`/game/${game.id}`);
  };

  return (
    <TableRow className="cursor-pointer" onClick={onNavigateToTheGame}>
      <TableCell>{opponent.player.username}</TableCell>
      <TableCell>
        <GameResultStatusLabel gameResult={player.gameResult} />
      </TableCell>
      <TableCell>
        {player.score} - {opponent.score}
      </TableCell>
      <TableCell>
        {game.finishGameDate ? getViewDateTime(game.finishGameDate) : '-'}
      </TableCell>
    </TableRow>
  );
};
