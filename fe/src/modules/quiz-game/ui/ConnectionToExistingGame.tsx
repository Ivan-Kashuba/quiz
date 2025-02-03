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
      <h1 className="scroll-m-20 text-center mb-8 font-extrabold tracking-tight text-3xl">
        You have ongoing game to finish
      </h1>
      <div>
        <Button variant="destructive" onClick={onNavigateToExistingGame}>
          Reconnect to the game
        </Button>
      </div>
    </>
  );
};
