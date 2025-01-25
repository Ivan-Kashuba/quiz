import { usePlayerConsumer } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';
import { Navigate } from 'react-router-dom';
import { TopGamePlayersCard } from '@/entities/TopGamePlayers/ui/TopGamePlayersCard.tsx';
import { CurrentUserGamesStatistic } from '@/entities/TopGamePlayers/ui/CurrentUserGamesStatistic.tsx';

export const GameConnectionRoomPage = () => {
  const { currentPlayer } = usePlayerConsumer();

  if (!currentPlayer) return <Navigate to="/" />;

  return (
    <div className="p-5">
      <div className="flex items-start gap-10">
        <TopGamePlayersCard />
        <div className="flex-1 bg-red-800">CONTENT</div>
        <CurrentUserGamesStatistic />
      </div>
    </div>
  );
};
