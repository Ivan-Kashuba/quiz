import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AdminApplication } from '@/modules/Admin/ui/AdminApplication.tsx';
import { HomePage } from '@/pages/HomePage.tsx';
import { AuthorizedPlayerLayout } from '@/modules/quiz-game/ui/layouts/AuthorizedPlayerLayout.tsx';
import { GameConnectionRoomPage } from '@/pages/GameConnectionRoomPage.tsx';
import { AuthorizationPage } from '@/pages/AuthorizationPage.tsx';
import { GamePage } from '@/pages/GamePage.tsx';

const router = createBrowserRouter([
  { path: '', element: <HomePage /> },
  { path: '/authorize', element: <AuthorizationPage /> },
  {
    path: '/connecting-room',
    element: (
      <AuthorizedPlayerLayout>
        <GameConnectionRoomPage />
      </AuthorizedPlayerLayout>
    ),
  },
  {
    path: '/game/:gameId',
    element: (
      <AuthorizedPlayerLayout>
        <GamePage />
      </AuthorizedPlayerLayout>
    ),
  },
  {
    path: '/admin/*',
    element: <AdminApplication />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
