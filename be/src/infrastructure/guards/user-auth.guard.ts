import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../features/users/api/domain/User';

@Injectable()
export class UserAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const userCode = request.headers.authorization;

    if (!userCode) {
      throw new UnauthorizedException();
    }

    const user = await User.findOne({ where: { code: userCode } });

    if (!user || !user?.isActive) {
      throw new UnauthorizedException();
    }

    request.user = {
      userId: user.id,
      userCode: user.code,
      username: user.username,
    };

    return true;
  }
}
