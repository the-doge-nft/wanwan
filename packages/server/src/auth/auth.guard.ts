import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { formatEthereumAddress } from '../helpers/strings';
import { UserService } from './../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly user: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const address = request.session?.siwe?.address;

    if (!address) {
      throw new UnauthorizedException();
    }

    const formattedAddress = formatEthereumAddress(address);
    console.log(formattedAddress);
    const _user = await this.user.findMany({
      where: { address: formattedAddress },
    });
    console.log(_user);
    const user = await this.user.upsert({
      where: { address: formattedAddress },
      create: { address: formattedAddress, lastAuthedAt: new Date() },
      update: { lastAuthedAt: new Date() },
    });
    request.user = user;
    return true;
  }
}
