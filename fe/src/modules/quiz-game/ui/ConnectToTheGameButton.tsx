import { Button } from '@/ui/button.tsx';
import { useNavigate } from 'react-router-dom';
import { useConnectToNewGame } from '@/modules/quiz-game/api/useConnectToNewGame.ts';
import { useMemo } from 'react';
import clx from 'classnames';

export const ConnectToTheGameButton = ({
  isLoading,
  gameId,
}: {
  isLoading: boolean;
  gameId?: string;
}) => {
  const navigate = useNavigate();
  const { mutate: connectToNewGame, isPending } = useConnectToNewGame();

  const onNavigateToExistingGame = () => {
    navigate(`/game/${gameId}`);
  };

  const buttonText = useMemo(() => {
    if (isLoading) return 'Collecting data...';

    if (gameId) return 'Reconnect to the game';

    return 'Connect to the game';
  }, [gameId, isLoading]);

  const onConnectionButtonClick = async () => {
    if (!gameId) {
      connectToNewGame();
      return;
    }

    onNavigateToExistingGame();
  };

  return (
    <Button
      variant="destructive"
      className={clx('w-full text-xl h-16 shadow-lg', {
        'bg-blue-600 hover:bg-blue-500 animate-pulse': !gameId,
      })}
      size="lg"
      onClick={onConnectionButtonClick}
      disabled={isLoading || isPending}
    >
      {buttonText}
    </Button>
  );
};
