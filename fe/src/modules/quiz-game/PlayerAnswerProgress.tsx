import { TPlayerProgress } from '@/entities/Game/types/game.ts';
import { StatusIcon } from '@/ui/status-icon.tsx';

export const PlayerAnswerProgress = ({
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
