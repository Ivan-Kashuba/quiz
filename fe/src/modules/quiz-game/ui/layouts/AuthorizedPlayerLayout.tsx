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
      <div className="bg-layout-secondary h-[calc(100vh-theme(height.header))] p-6">
        {children}
      </div>
    </>
  );
};
