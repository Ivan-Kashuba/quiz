import { useNavigate } from 'react-router-dom';
import { useToast } from '@/shared/hooks/shadcn/use-toast.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '@/shared/lib/axios/http.ts';
import { TGame } from '@/entities/Game/types/game.ts';
import { ApiKeys } from '@/shared/constants/api-keys.ts';

export const useConnectToNewGame = () => {
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
