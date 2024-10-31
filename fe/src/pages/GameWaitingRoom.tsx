import { usePlayerConsumer } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';
import { Navigate } from 'react-router-dom';

export const GameWaitingRoom = () => {
  const { currentPlayer } = usePlayerConsumer();

  if (!currentPlayer) return <Navigate to="/" />;

  return (
    <h1 className="text-2xl font-bold text-center">
      WAITING ROOM, {currentPlayer?.username}
    </h1>
  );
};
