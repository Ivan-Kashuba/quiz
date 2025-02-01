import { useQuery } from '@tanstack/react-query';
import { ApiKeys } from '@/shared/constants/api-keys.ts';
import { http } from '@/shared/lib/axios/http.ts';
import { PlayerGamesStatistic } from '@/entities/TopGamePlayers/types/top-game-player.ts';

export const useCurrentUserGamesStatistic = () => {
  return useQuery({
    queryKey: [ApiKeys.USER_GAMES_STATISTIC],
    queryFn: async () => {
      return http
        .get<PlayerGamesStatistic>(`pair-game-quiz/pairs/users/my-statistic`)
        .then((res) => res.data);
    },
    retry: 2,
  });
};
