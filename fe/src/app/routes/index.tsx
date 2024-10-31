import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AdminApplication } from '@/modules/Admin/ui/AdminApplication.tsx';
import { HomePage } from '@/pages/HomePage.tsx';
import { AuthorizedPlayerLayout } from '@/modules/quiz-game/ui/layouts/AuthorizedPlayerLayout.tsx';
import { GameWaitingRoom } from '@/pages/GameWaitingRoom.tsx';
import { AuthorizationPage } from '@/pages/AuthorizationPage.tsx';

const router = createBrowserRouter([
  { path: '', element: <HomePage /> },
  { path: '/authorize', element: <AuthorizationPage /> },
  {
    path: '/waiting-room',
    element: (
      <AuthorizedPlayerLayout>
        <GameWaitingRoom />
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
