import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AdminApplication } from '@/modules/Admin/ui/AdminApplication.tsx';
import { HomePage } from '@/pages/HomePage.tsx';

const router = createBrowserRouter([
  { path: '', element: <HomePage /> },
  {
    path: '/about',
    element: <div>About</div>,
  },
  {
    path: '/admin/*',
    element: <AdminApplication />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
