import { Button } from '@/ui/button.tsx';
import { useNavigate } from 'react-router-dom';

export const ConnectionToExistingGame = ({
  currentGameId,
}: {
  currentGameId: string;
}) => {
  const navigate = useNavigate();

  const onNavigateToExistingGame = () => {
    navigate(`/game/${currentGameId}`);
  };

  return (
    <>
      <h1 className="scroll-m-20 text-center text-4xl mb-8 font-extrabold tracking-tight lg:text-5xl">
        Reconnect to the current game
      </h1>
      <div>
        <Button variant="destructive" onClick={onNavigateToExistingGame}>
          Reconnect to the game
        </Button>
      </div>
    </>
  );
};
