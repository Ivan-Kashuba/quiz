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

export enum PlayerGameResult {
  Loose = 0,
  Win = 1,
  Draw = 2,
  Unfinished = 3,
}
