import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { formatEthereumAddress } from '../helpers/strings';
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

    const formattedAddress = formatEthereumAddress(address);
    const user = await this.user.upsert({
      where: { address: formattedAddress },
      create: { address: formattedAddress, lastAuthedAt: new Date() },
      update: {},
    });
    request.user = user;
    return true;
  }
}
