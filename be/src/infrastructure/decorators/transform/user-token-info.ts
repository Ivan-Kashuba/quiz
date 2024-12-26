import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TUserAuthInfo } from '../../../features/auth/types/auth.types';

export const UserTokenInfo = createParamDecorator(
  (data: keyof TUserAuthInfo, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user && user[data] : user;
  },
);
