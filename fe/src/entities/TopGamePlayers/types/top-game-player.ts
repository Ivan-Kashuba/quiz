export type TopGameUserStatistic = PlayerGamesStatistic & {
  player: {
    id: string;
    username: string;
  };
};

export type PlayerGamesStatistic = {
  sumScore: number;
  avgScores: number;
  gamesCount: number;
  winsCount: number;
  lossesCount: number;
  drawsCount: number;
};
