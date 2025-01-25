import { useQuery } from '@tanstack/react-query';
import { ApiKeys } from '@/shared/constants/api-keys.ts';
import { http } from '@/shared/lib/axios/http.ts';
import { TopGameUserStatistic } from '@/entities/TopGamePlayers/types/top-game-player.ts';
import { WithPagination } from '@/shared/types/pagination.ts';

export const useTopPlayers = () => {
  return useQuery({
    queryKey: [ApiKeys.TOP_PLAYERS],
    queryFn: async () => {
      return http
        .get<WithPagination<TopGameUserStatistic>>(`pair-game-quiz/users/top`)
        .then((res) => res.data);
    },
    refetchOnMount: false,
  });
};
