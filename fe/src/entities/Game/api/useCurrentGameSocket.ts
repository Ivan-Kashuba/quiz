import { GameSocketEvents, socket } from '@/shared/lib/socket/socket';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useCurrentGameSocket = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    socket.on(GameSocketEvents.AnswerTheQuestion, (newState: any) => {
      console.log('newState', newState);
    });

    socket.on(GameSocketEvents.GetCurrentGameDetails, (initialGame: any) => {
      console.log('initialGame', initialGame);
    });

    return () => {
      socket.disconnect();
      socket.off(GameSocketEvents.AnswerTheQuestion);
      socket.off(GameSocketEvents.AnswerTheQuestion);
    };
  }, [isConnected]);

  return { isConnected };
};
