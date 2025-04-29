import { usePlayerConsumer } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';
import { Navigate } from 'react-router-dom';
import { TopGamePlayersCard } from '@/entities/TopGamePlayers/ui/TopGamePlayersCard.tsx';
import { CurrentUserGamesStatistic } from '@/entities/TopGamePlayers/ui/CurrentUserGamesStatistic.tsx';
import { useCurrentGame } from '@/entities/Game/api/useCurrentGame.ts';
import { ConnectToTheGameButton } from '@/modules/quiz-game/ui/ConnectToTheGameButton.tsx';
import { PlayerRecentGames } from '@/modules/quiz-game/ui/PlayerRecentGames/PlayerRecentGames.tsx';
import { useCurrentGameSocket } from '@/entities/Game/api/useCurrentGameSocket';

export const GameConnectionRoomPage = () => {
  const { currentPlayer } = usePlayerConsumer();
  const { data: currentGame, isLoading } = useCurrentGame();
  const { isConnected } = useCurrentGameSocket();

  if (!currentPlayer) return <Navigate to="/" />;

  return (
    <div className="p-5">
      <div className="w-full flex gap-10 flex-wrap justify-center">
        <div className="flex-1 order-2 lg:order-1 flex flex-col gap-6">
          <PlayerRecentGames />
          <TopGamePlayersCard />
        </div>

        <div className="flex flex-col gap-6 order-1 lg:order-2">
          <CurrentUserGamesStatistic />

          <div className="w-full flex flex-col items-center">
            <ConnectToTheGameButton
              gameId={currentGame?.id}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
