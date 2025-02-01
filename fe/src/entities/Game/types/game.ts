export type TGame = {
  id: string;
  firstPlayerProgress: TPlayerProgress;
  secondPlayerProgress: TPlayerProgress;
  questions: TGameQuestion[];
  status: GameStatus;
  pairCreatedDate: Date;
  startGameDate: Date;
  finishGameDate: Date;
};

export type TPlayerProgress = {
  answers: GameAnswer[];
  player: TGameUser;
  score: number;
};

export type GameAnswer = {
  questionId: string;
  answerStatus: AnswerStatus;
  addedAt: Date;
};

export type TGameUser = {
  id: string;
  username: string;
};

export type TGameQuestion = {
  id: string;
  body: string;
};

export enum AnswerStatus {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
}

export enum GameStatus {
  PendingSecondPlayer = 'PendingSecondPlayer',
  Active = 'Active',
  Finished = 'Finished ',
}
