import { Socket } from 'socket.io';
import { UserWsAuthGuard } from '../guards/user-ws-auth.guard';

export type SocketIOMiddleware = {
  (client: Socket, next: (err?: Error) => void);
};

export const SocketIoAuthMiddleware = (): SocketIOMiddleware => {
  return async (client, next) => {
    try {
      await UserWsAuthGuard.validateAuth(client);
      next();
    } catch (error) {
      next(error);
    }
  };
};
