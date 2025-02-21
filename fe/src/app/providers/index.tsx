import { FC, ReactNode } from 'react';
import { PlayerProvider } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';
import { ReactQueryProvider } from '@/app/providers/ReactQueryProvider/ReactQueryProvider.tsx';
import { GoogleProvider } from '@/app/providers/GoogleProvider/GoogleProvider.tsx';

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <GoogleProvider>
        <PlayerProvider>{children}</PlayerProvider>
      </GoogleProvider>
    </ReactQueryProvider>
  );
};
