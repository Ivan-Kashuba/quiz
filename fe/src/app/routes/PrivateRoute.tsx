import { FC, ReactNode } from 'react';
import { LocalStorageKey } from '@/shared/lib/localstorage';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: ReactNode;
  redirectedTo?: string;
}

export const PrivateRoute: FC<PrivateRouteProps> = ({
  children,
  redirectedTo = '/login',
}) => {
  const isAuth = !!localStorage.getItem(LocalStorageKey.accessToken);

  return isAuth ? children : <Navigate to={redirectedTo} replace />;
};
