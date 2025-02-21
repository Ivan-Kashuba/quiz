import { useRecentGames } from '@/entities/Game/api/useRecentGames.ts';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card.tsx';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table.tsx';
import { RecentGameRow } from '@/modules/quiz-game/ui/PlayerRecentGames/RecentGameRow.tsx';

export const PlayerRecentGames = () => {
  const { data: games } = useRecentGames();

  if (!games?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Games</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Opponent</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Finished</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games?.map((game) => <RecentGameRow key={game.id} game={game} />)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
