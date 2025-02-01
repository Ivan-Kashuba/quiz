import { Navigate, useParams } from 'react-router-dom';
import { useGameById } from '@/entities/Game/api/useGameById.ts';
import { PageLoader } from '@/ui/page-loader.tsx';

export const GamePage = () => {
  const { gameId } = useParams();

  const { data: game, isLoading } = useGameById(gameId!);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!game) {
    return <Navigate to="/connecting-room" />;
  }

  const isBothPlayersConnected = !!game.pairCreatedDate;

  if (!isBothPlayersConnected) {
    return <div>Awaiting for the opponent</div>;
  }

  return (
    <div>
      <h1>Welcome the the game {game.status}</h1>
    </div>
  );
};
