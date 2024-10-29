import { LocalStorageKey } from '@/shared/lib/localstorage';
import { ReactNode } from 'react';

export const AuthOnlyRoute = ({ children }: { children: ReactNode }) => {
  const isAuth = !!localStorage.getItem(LocalStorageKey.accessToken);

  if (!isAuth) {
    return children;
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <h1>Not found</h1>
    </div>
  );
};
