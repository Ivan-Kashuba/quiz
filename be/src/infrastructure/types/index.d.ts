import { TUserAuthInfo } from '../../features/auth/types/auth.types';

export type TClass = { new (...args: any[]): any };

declare global {
  namespace Express {
    interface Request {
      user?: TUserAuthInfo;
    }
  }
}