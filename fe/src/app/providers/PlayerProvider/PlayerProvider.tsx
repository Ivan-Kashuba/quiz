import { createContext, ReactNode, useContext, useState } from 'react';
import { TUser } from '@/entities/User/types/user.ts';
import { LocalStorageKey } from '@/shared/lib/localstorage';

interface IPlayerProviderContextProps {
  currentPlayer: TUser | null;
  isFirstTime: boolean;
  setCurrentPlayer: (player: TUser | null) => void;
  setFirstTime: (flag: boolean) => void;
}

const defaultPlayerContextValues: IPlayerProviderContextProps = {
  currentPlayer: JSON.parse(
    localStorage.getItem(LocalStorageKey.currentPlayer) || 'null'
  ),
  isFirstTime: JSON.parse(
    localStorage.getItem(LocalStorageKey.isFirstPlayerCreating) || 'false'
  ),
  setCurrentPlayer: (_player: TUser | null) => {},
  setFirstTime: (_flag: boolean) => {},
};

const PlayerContext = createContext<IPlayerProviderContextProps>(
  defaultPlayerContextValues
);

const usePlayer = () => {
  const [currentPlayer, setCurrentPlayerState] = useState(
    defaultPlayerContextValues.currentPlayer
  );
  const [isFirstTime, setFirstTimeState] = useState(
    defaultPlayerContextValues.isFirstTime
  );

  const setCurrentPlayer = (player: TUser | null) => {
    setCurrentPlayerState(player);
    localStorage.setItem(LocalStorageKey.currentPlayer, JSON.stringify(player));
  };

  const setFirstTime = (flag: boolean) => {
    setFirstTimeState(flag);
    localStorage.setItem(
      LocalStorageKey.isFirstPlayerCreating,
      JSON.stringify(flag)
    );
  };

  return { currentPlayer, isFirstTime, setCurrentPlayer, setFirstTime };
};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const playerContextValue = usePlayer();

  return (
    <PlayerContext.Provider value={playerContextValue}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerConsumer() {
  return useContext(PlayerContext);
}
