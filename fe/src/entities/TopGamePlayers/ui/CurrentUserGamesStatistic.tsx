import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card.tsx';
import { Skeleton } from '@/ui/skeleton.tsx';
import { useCurrentUserGamesStatistic } from '@/entities/TopGamePlayers/api/useCurrentUserGamesStatistic.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faEquals,
  faGamepad,
  faStar,
  faTimes,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FC } from 'react';
import clx from 'classnames';

export const CurrentUserGamesStatistic = () => {
  const { data, isLoading } = useCurrentUserGamesStatistic();

  const statisticItemsArray: StatisticItem[] = [
    {
      title: 'Games Played',
      number: data?.gamesCount,
      icon: faGamepad,
      iconClassname: 'text-blue-500',
    },
    {
      title: 'Wins',
      number: data?.winsCount,
      icon: faTrophy,
      iconClassname: 'text-green-500',
    },
    {
      title: 'Losses',
      number: data?.lossesCount,
      icon: faTimes,
      iconClassname: 'text-red-500',
    },
    {
      title: 'Draws',
      number: data?.drawsCount,
      icon: faEquals,
      iconClassname: 'text-yellow-500',
    },
    {
      title: 'Avg Score',
      number: data?.avgScores,
      icon: faChartBar,
      iconClassname: 'text-purple-500',
    },
    {
      title: 'Total Score',
      number: data?.sumScore,
      icon: faStar,
      iconClassname: 'text-orange-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your statistic</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-4">
        {isLoading ? (
          <Skeleton className="w-full h-28" />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {statisticItemsArray.map((si) => (
              <StatisticItem {...si} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

type StatisticItem = {
  title: string;
  icon: IconProp;
  number?: number;
  iconClassname?: string;
};

const StatisticItem: FC<StatisticItem> = ({
  title,
  number,
  icon,
  iconClassname,
}) => {
  return (
    <div className="flex items-center gap-2">
      <FontAwesomeIcon icon={icon} className={clx('text-xl', iconClassname)} />
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-lg font-bold">{number ?? 0}</p>
      </div>
    </div>
  );
};
