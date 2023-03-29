import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

export const ADMIN_ADDRESSES = [
  '0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5',
  '0x18F33CEf45817C428d98C4E188A770191fDD4B79',
  '0x933B2863f079F2E7033cfE0BadcfEa3378455F17',
];

@Injectable()
export class AdminGuard extends AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthed = await super.canActivate(context);
    if (!isAuthed) {
      return isAuthed;
    }
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    return ADMIN_ADDRESSES.includes(user.address);
  }
}
