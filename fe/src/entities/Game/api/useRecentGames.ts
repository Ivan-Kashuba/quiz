import { useQuery } from '@tanstack/react-query';
import { ApiKeys } from '@/shared/constants/api-keys.ts';
import { http } from '@/shared/lib/axios/http.ts';
import { TGame } from '@/entities/Game/types/game.ts';
import { WithPagination } from '@/shared/types/pagination.ts';

export const useRecentGames = () => {
  return useQuery({
    queryKey: [ApiKeys.RECENT_GAMES],
    queryFn: async () => {
      return http
        .get<WithPagination<TGame>>(`pair-game-quiz/pairs/my`)
        .then((res) => res.data.data);
    },
    retry: false,
  });
};
