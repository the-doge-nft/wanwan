import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from './../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly user: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const address = request.session?.siwe?.address;

    if (!address) {
      return false;
    }

    const user = await this.user.upsert({
      where: { address },
      create: { address, lastAuthedAt: new Date() },
      update: {},
    });
    request.user = user;
    return true;
  }
}
