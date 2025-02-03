import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useGameById } from '@/entities/Game/api/useGameById.ts';
import { PageLoader } from '@/ui/page-loader.tsx';
import {
  GameStatus,
  TGame,
  TPlayerProgress,
} from '@/entities/Game/types/game.ts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card.tsx';
import { Button } from '@/ui/button.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Textarea } from '@/ui/textarea.tsx';
import { useToast } from '@/shared/hooks/shadcn/use-toast.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '@/shared/lib/axios/http.ts';
import { ApiKeys } from '@/shared/constants/api-keys.ts';
import { useState } from 'react';
import { usePlayerConsumer } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';
import { StatusIcon } from '@/ui/status-icon.tsx';

export const GamePage = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();

  const { data: game, isLoading } = useGameById(gameId!);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!game) {
    return <Navigate to="/connecting-room" />;
  }

  const isBothPlayersConnected = !!game.pairCreatedDate;
  const isGameFinished = game.status === GameStatus.Finished;

  if (!isBothPlayersConnected) {
    return <AwaitingScreen game={game} />;
  }

  const getGameResultString = (game: TGame) => {
    const { firstPlayerProgress, secondPlayerProgress } = game;

    const sortedByPointsProgresses = [
      firstPlayerProgress,
      secondPlayerProgress,
    ].sort((a, b) => b.score - a.score);

    if (
      sortedByPointsProgresses[0].score === sortedByPointsProgresses[1].score
    ) {
      return 'Draw';
    }

    return `The winner is ${sortedByPointsProgresses[0].player.username}`;
  };

  if (isGameFinished) {
    return (
      <div>
        <h1 className="text-2xl text-center">
          <Card className="pt-2 py-4">
            <CardTitle className="text-2xl">Game is finished</CardTitle>
            <CardDescription className="my-2">
              <div>
                Game finished date:
                {' ' + new Date(game.finishGameDate).toLocaleString()}
              </div>
              <div>Game result: {getGameResultString(game)}</div>
            </CardDescription>
            <CardContent className="flex items-center flex-col gap-5">
              <PlayerAnswerProgress playerProgress={game.firstPlayerProgress} />
              <PlayerAnswerProgress
                playerProgress={game.secondPlayerProgress}
              />
            </CardContent>

            <Button onClick={() => navigate('/connecting-room')}>
              Back to the home
            </Button>
          </Card>
        </h1>
      </div>
    );
  }

  return (
    <div>
      <GameScreen game={game} />
    </div>
  );
};

const useAnswerToTheQuestion = () => {
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
      console.log('game:', game);
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

const PlayerAnswerProgress = ({
  playerProgress,
}: {
  playerProgress: TPlayerProgress;
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold">
        {playerProgress.player.username}
      </h3>
      <p>Score: {playerProgress.score}</p>
      <div className="flex gap-4 mt-2">
        {[...Array(5)].map((_, index) => {
          const answer = playerProgress.answers[index];
          return (
            <div key={index}>
              <p>Question {index + 1}</p>
              <div>
                <div className="flex items-center gap-1">
                  <StatusIcon
                    isSuccess={
                      answer ? answer.answerStatus === 'Correct' : null
                    }
                  />
                  <p
                    className={
                      answer
                        ? answer.answerStatus === 'Correct'
                          ? 'text-green-500'
                          : 'text-red-500'
                        : 'text-gray-500'
                    }
                  >
                    {answer ? answer.answerStatus : 'No answer'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const GameScreen = ({ game }: { game: TGame }) => {
  const { isPending, mutateAsync } = useAnswerToTheQuestion();
  const [answerText, setAnswerText] = useState('');
  const { currentPlayer: currentUser } = usePlayerConsumer();

  const onAnswerTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(e.target.value);
  };

  const onSaveAnswer = async () => {
    if (!answerText.trim().length) return;

    await mutateAsync(answerText);
    setAnswerText('');
  };

  const { firstPlayerProgress, secondPlayerProgress, questions } = game;

  const currentPlayerProgress = [
    firstPlayerProgress,
    secondPlayerProgress,
  ].find((p) => p.player.id === currentUser?.id)!;

  const opponentPlayerProgress = [
    firstPlayerProgress,
    secondPlayerProgress,
  ].find((p) => p.player.id !== currentUser?.id)!;

  const currentQuestion = questions.find(
    (q) => !currentPlayerProgress.answers.some((a) => a.questionId === q.id)
  );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Players progress</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <PlayerAnswerProgress playerProgress={currentPlayerProgress} />
          <PlayerAnswerProgress playerProgress={opponentPlayerProgress} />
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle>Your Question</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            {currentQuestion?.body ||
              'No more questions! Waiting for opponent responses...'}
          </p>
        </CardContent>
      </Card>

      {/* Answer Textarea */}
      <Card>
        <CardHeader>
          <CardTitle>Your Answer</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            className="w-full bg-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Type your answer here..."
            onChange={onAnswerTextChange}
            value={answerText}
          />
          <Button
            disabled={isPending}
            size="lg"
            variant="destructive"
            className="mt-6"
            onClick={onSaveAnswer}
          >
            Submit Answer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const AwaitingScreen = ({ game }: { game: TGame }) => {
  const { firstPlayerProgress } = game;

  return (
    <div className="bg-gray-900 text-white font-sans min-h-screen flex flex-col p-8">
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow">
        {/* Connected Player Info */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center mb-8">
          <h2 className="text-xl font-bold mb-4">Connected Player</h2>
          <p className="text-lg">
            <span className="text-blue-400">
              {firstPlayerProgress.player.username}
            </span>{' '}
            is ready to play!
          </p>
        </div>

        {/* Waiting Message */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
          <h2 className="text-xl font-bold mb-4">Waiting for Opponent</h2>
          <div className="flex items-center justify-center gap-4">
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin text-2xl text-blue-500"
            />
            <p className="text-lg">Please wait while we find an opponent...</p>
          </div>
        </div>
      </main>
    </div>
  );
};
