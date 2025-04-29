import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from '../../features/users/api/domain/User';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class UserWsAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'ws') return true;

    const client: Socket = context.switchToWs().getClient();
    await UserWsAuthGuard.validateAuth(client);

    return true;
  }

  static async validateAuth(client: Socket) {
    const authorization = client.handshake.auth.token;

    if (!authorization) {
      throw new WsException('Not authorized');
    }

    const user = await User.findOne({ where: { code: authorization } });

    if (!user) {
      throw new WsException('Code is not valid');
    }

    client.data.user = {
      userId: user.id,
      userCode: user.code,
      username: user.username,
    };

    return true;
  }
}
