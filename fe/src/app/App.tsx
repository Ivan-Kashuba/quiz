import { AppRouter } from '@/app/routes';
import { Toaster } from '@/ui/toaster.tsx';
import { Admin, ListGuesser, Resource } from 'react-admin';

export function App() {
  return (
    <>
      <AppRouter />

      <Toaster />
    </>
  );
}
