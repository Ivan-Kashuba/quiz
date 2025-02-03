import { ReactNode } from 'react';
import { Header } from '@/modules/quiz-game/ui/layouts/Header.tsx';

export const AuthorizedPlayerLayout = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <>
      <Header />
      <main className="bg-layout-secondary overflow-y-auto h-[calc(100vh-theme(height.header))] p-6">
        {children}
      </main>
    </>
  );
};
