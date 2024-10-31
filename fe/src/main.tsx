import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/styles/index.css';
import { App } from '@/app/App.tsx';
import { PlayerProvider } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </StrictMode>
);
