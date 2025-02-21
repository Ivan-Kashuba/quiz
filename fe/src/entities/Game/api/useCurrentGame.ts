import { useQuery } from '@tanstack/react-query';
import { ApiKeys } from '@/shared/constants/api-keys.ts';
import { http } from '@/shared/lib/axios/http.ts';
import { TGame } from '@/entities/Game/types/game.ts';

export const useCurrentGame = () => {
  return useQuery({
    queryKey: [ApiKeys.CURRENT_GAME],
    queryFn: async () => {
      return http
        .get<TGame>(`pair-game-quiz/pairs/my-current`)
        .then((res) => res.data);
    },
    staleTime: 0,
    refetchOnMount: true,
    retry: false,
    gcTime: 0,
  });
};
