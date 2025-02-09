import { useToast } from '@/shared/hooks/shadcn/use-toast.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '@/shared/lib/axios/http.ts';
import { TGame } from '@/entities/Game/types/game.ts';
import { ApiKeys } from '@/shared/constants/api-keys.ts';

export const useAnswerToTheQuestion = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (answer: string) => {
      const response = await http.post<TGame>(
        `pair-game-quiz/pairs/my-current/answers`,
        {
          answer,
        }
      );

      return response.data;
    },
    onSuccess: (game) => {
      toast({
        variant: 'default',
        title: 'Answer is given',
      });

      queryClient.setQueryData([ApiKeys.GAME, game.id], game);
    },
    onError: (_err) => {
      toast({
        variant: 'destructive',
        title: 'Your answer have not been saved, try again',
      });
    },
  });
};
