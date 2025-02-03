import { useTopPlayers } from '@/entities/TopGamePlayers/api/useTopPlayers.tsx';
import { Card, CardHeader, CardTitle } from '@/ui/card';
import { CardContent } from '@/ui/card.tsx';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { TableBody } from '@/ui/table.tsx';
import { Skeleton } from '@/ui/skeleton.tsx';

export const TopGamePlayersCard = () => {
  const { data: topPlayers, isLoading } = useTopPlayers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top players</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Games</TableHead>
              <TableHead>Wins</TableHead>
              <TableHead>AVG score</TableHead>
              <TableHead>Total score</TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="w-full h-6" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              {topPlayers?.data.map((p) => {
                return (
                  <TableRow key={p.player.id}>
                    <TableCell className="font-medium">
                      {p.player.username}
                    </TableCell>
                    <TableCell className="text-center">
                      {p.gamesCount}
                    </TableCell>
                    <TableCell className="text-center">{p.winsCount}</TableCell>
                    <TableCell className="text-center">
                      {Number(p.avgScores)}
                    </TableCell>
                    <TableCell className="text-center">
                      {Number(p.sumScore)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  );
};
