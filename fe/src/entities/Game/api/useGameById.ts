import { useQuery } from '@tanstack/react-query';
import { ApiKeys } from '@/shared/constants/api-keys.ts';
import { http } from '@/shared/lib/axios/http.ts';
import { TGame } from '@/entities/Game/types/game.ts';

export const useGameById = (gameId: string) => {
  return useQuery({
    queryKey: [ApiKeys.GAME],
    queryFn: async () => {
      return http
        .get<TGame>(`pair-game-quiz/pairs/${gameId}`)
        .then((res) => res.data);
    },
    retry: false,
  });
};
