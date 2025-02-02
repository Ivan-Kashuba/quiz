import { usePlayerConsumer } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';
import { Navigate } from 'react-router-dom';
import { TopGamePlayersCard } from '@/entities/TopGamePlayers/ui/TopGamePlayersCard.tsx';
import { CurrentUserGamesStatistic } from '@/entities/TopGamePlayers/ui/CurrentUserGamesStatistic.tsx';
import { ConnectionToTheNewGame } from '@/modules/quiz-game/ui/ConnectionToTheNewGame.tsx';
import { useCurrentGame } from '@/entities/Game/api/useCurrentGame.ts';
import { Skeleton } from '@/ui/skeleton.tsx';
import { ConnectionToExistingGame } from '@/modules/quiz-game/ui/ConnectionToExistingGame.tsx';

export const GameConnectionRoomPage = () => {
  const { currentPlayer } = usePlayerConsumer();
  const { data: currentGame, isLoading } = useCurrentGame();

  if (!currentPlayer) return <Navigate to="/" />;

  return (
    <div className="p-5">
      <div className="w-full flex gap-10 flex-wrap justify-center">
        <div className="flex flex-col gap-6">
          <CurrentUserGamesStatistic />

          <div className="w-full flex flex-col items-center">
            {isLoading && <Skeleton className="w-full h-32" />}
            {!isLoading && currentGame && (
              <ConnectionToExistingGame currentGameId={currentGame.id} />
            )}
            {!isLoading && !currentGame && <ConnectionToTheNewGame />}
          </div>
        </div>

        <div className="flex-1">
          <TopGamePlayersCard />
        </div>
      </div>
    </div>
  );
};
