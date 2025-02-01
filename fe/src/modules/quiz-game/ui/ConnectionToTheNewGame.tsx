import { Button } from '@/ui/button.tsx';
import { http } from '@/shared/lib/axios/http.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TGame } from '@/entities/Game/types/game.ts';
import { ApiKeys } from '@/shared/constants/api-keys.ts';
import { useToast } from '@/shared/hooks/shadcn/use-toast.ts';
import { useNavigate } from 'react-router-dom';

const useConnectToNewGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await http.post<TGame>(
        `pair-game-quiz/pairs/connection`
      );

      return response.data;
    },
    onSuccess: (game) => {
      queryClient.setQueryData([ApiKeys.CURRENT_GAME], game);
      navigate(`/game/${game.id}`);
    },
    onError: (_err) => {
      toast({
        variant: 'destructive',
        title: 'Connection to the game was failed',
      });
    },
  });
};

export const ConnectionToTheNewGame = () => {
  const { mutate: connectToNewGame, isPending } = useConnectToNewGame();

  return (
    <>
      <h1 className="scroll-m-20 text-center text-4xl mb-8 font-extrabold tracking-tight lg:text-5xl">
        Start a new game
      </h1>
      <div>
        <Button disabled={isPending} onClick={() => connectToNewGame()}>
          {isPending ? 'Connecting...' : 'Connect to New Game'}
        </Button>
      </div>
    </>
  );
};
