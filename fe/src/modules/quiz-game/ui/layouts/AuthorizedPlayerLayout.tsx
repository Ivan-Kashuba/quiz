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
      {children}
    </>
  );
};
