import { Card, CardContent, CardDescription, CardTitle } from '@/ui/card.tsx';
import { getGameResultString } from '@/modules/quiz-game/helpers/getGameResultString.ts';
import { Button } from '@/ui/button.tsx';
import { PlayerAnswerProgress } from '@/modules/quiz-game/PlayerAnswerProgress.tsx';
import { TGame } from '@/entities/Game/types/game.ts';
import { useNavigate } from 'react-router-dom';
import { getViewDateTime } from '@/shared/lib/date/date-display-format.ts';

export const FinishedGameInfo = ({ game }: { game: TGame }) => {
  const navigate = useNavigate();

  const onBackHome = () => {
    navigate('/connecting-room');
  };

  return (
    <div>
      <h1 className="text-2xl text-center">
        <Card className="px-2 py-4">
          <CardTitle className="text-2xl">Game is finished</CardTitle>
          <CardDescription className="my-2">
            <div>
              Game finished date: {getViewDateTime(game.finishGameDate)}
            </div>
            <div>Game result: {getGameResultString(game)}</div>
          </CardDescription>
          <CardContent className="flex items-center flex-col gap-5">
            <PlayerAnswerProgress playerProgress={game.firstPlayerProgress} />
            <PlayerAnswerProgress playerProgress={game.secondPlayerProgress} />
          </CardContent>

          <Button onClick={onBackHome}>Back to the home</Button>
        </Card>
      </h1>
    </div>
  );
};
