import { AppRouter } from '@/app/routes';
import { Toaster } from '@/ui/toaster.tsx';

export function App() {
  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  );
}
