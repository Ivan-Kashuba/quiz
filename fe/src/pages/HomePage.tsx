import { usePlayerConsumer } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';
import { Navigate } from 'react-router-dom';
import { ShowUserInfo } from '@/modules/player-initializing/ui/ShowUserInfo.tsx';
import { CreateUsernameForm } from '@/modules/player-initializing/ui/CreateUsernameForm.tsx';

export const HomePage = () => {
  const { currentPlayer, isFirstTime } = usePlayerConsumer();

  if (currentPlayer && !isFirstTime) return <Navigate to="/waiting-room" />;

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      {currentPlayer && isFirstTime && <ShowUserInfo />}
      {!currentPlayer && <CreateUsernameForm />}
    </div>
  );
};
