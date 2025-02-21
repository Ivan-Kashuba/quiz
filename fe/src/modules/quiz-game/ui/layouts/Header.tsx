import { Button } from '@/ui/button.tsx';
import { usePlayerConsumer } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { currentPlayer, setCurrentPlayer } = usePlayerConsumer();
  const navigate = useNavigate();

  const onChangeUserName = () => {
    setCurrentPlayer(null);
    navigate('/');
  };

  return (
    <header className="flex h-header items-center bg-layout-primary text-white justify-between w-full py-2 px-4">
      <h2 className="text-xl">
        You are playing as
        <b className="text-[#2d7ef4]"> {currentPlayer?.username}</b>
      </h2>
      <Button size="default" variant="secondary" onClick={onChangeUserName}>
        Change account
      </Button>
    </header>
  );
};
