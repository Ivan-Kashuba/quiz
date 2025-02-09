import { Navigate, useParams } from 'react-router-dom';
import { useGameById } from '@/entities/Game/api/useGameById.ts';
import { PageLoader } from '@/ui/page-loader.tsx';
import { GameStatus } from '@/entities/Game/types/game.ts';
import { FinishedGameInfo } from '@/entities/Game/ui/FinishedGameInfo.tsx';
import { OngoingGamePlay } from '@/entities/Game/ui/OngoingGamePlay.tsx';
import { AwaitingOpponentLoader } from '@/modules/quiz-game/ui/AwaitingOpponentLoader.tsx';

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
  const isGameFinished = game.status === GameStatus.Finished;

  if (!isBothPlayersConnected) {
    return <AwaitingOpponentLoader />;
  }

  if (isGameFinished) {
    return <FinishedGameInfo game={game} />;
  }

  return <OngoingGamePlay game={game} />;
};
