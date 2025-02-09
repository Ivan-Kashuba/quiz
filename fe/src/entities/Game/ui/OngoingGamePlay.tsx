import { TGame } from '@/entities/Game/types/game.ts';
import { useState } from 'react';
import { usePlayerConsumer } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card.tsx';
import { Textarea } from '@/ui/textarea.tsx';
import { Button } from '@/ui/button.tsx';
import { useAnswerToTheQuestion } from '@/entities/Game/api/useAnswerToTheQuestion.ts';
import { PlayerAnswerProgress } from '@/modules/quiz-game/PlayerAnswerProgress.tsx';

export const OngoingGamePlay = ({ game }: { game: TGame }) => {
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
