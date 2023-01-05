import { Injectable } from '@nestjs/common';
import { EthersService } from './../ethers/ethers.service';
import {
  formatEthereumAddress,
  isValidEthereumAddress,
} from './../helpers/strings';
import { PrismaService } from './../prisma.service';
import { UserService } from './../user/user.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ethers: EthersService,
    private readonly user: UserService,
  ) {}
  async get(addressOrEns: string) {
    const isAddress = isValidEthereumAddress(addressOrEns);
    const avatar = await this.ethers.getAvatar(addressOrEns);
    let ens: null | string;
    let address: string;
    if (isAddress) {
      console.log('hit');
      address = formatEthereumAddress(addressOrEns);
      ens = await this.ethers.getEnsName(address);
    } else {
      address = await this.ethers.getEnsName(addressOrEns);
    }
    const user = await this.user.findFirst({ where: { address } });
    return { ens, address, avatar, user };
  }
}
