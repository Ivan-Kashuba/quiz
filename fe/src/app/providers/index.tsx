import { FC, ReactNode } from 'react';
import { PlayerProvider } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';
import { ReactQueryProvider } from '@/app/providers/ReactQueryProvider/ReactQueryProvider.tsx';

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <PlayerProvider>{children}</PlayerProvider>
    </ReactQueryProvider>
  );
};
