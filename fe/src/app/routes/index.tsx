import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage.tsx';
import { PrivateRoute } from '@/app/routes/PrivateRoute.tsx';
import { NotAuthOnlyRoute } from '@/app/routes/AuthOnlyRouter.tsx';

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <NotAuthOnlyRoute>
        <LoginPage />
      </NotAuthOnlyRoute>
    ),
  },
  {
    path: '/about',
    element: <div>About</div>,
  },
  {
    path: '/secure',
    element: (
      <PrivateRoute>
        <div>Secure</div>
      </PrivateRoute>
    ),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
