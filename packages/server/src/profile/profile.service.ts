import { Injectable } from '@nestjs/common';
import { EthersService } from './../ethers/ethers.service';
import {
  formatEthereumAddress,
  isValidEthereumAddress,
} from './../helpers/strings';
import { PrismaService } from './../prisma.service';
import { UserService } from './../user/user.service';

export class NameNotFoundError extends Error {
  constructor() {
    super('Invalid name');
  }
}

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ethers: EthersService,
    private readonly user: UserService,
  ) {}
  async get(addressOrEns: string) {
    const isAddress = isValidEthereumAddress(addressOrEns);
    let avatar: null | string;
    let ens: null | string = addressOrEns;
    let address: string;
    if (isAddress) {
      address = formatEthereumAddress(addressOrEns);
      ens = await this.ethers.getEnsName(address);
      if (ens) {
        avatar = await this.ethers.getAvatar(ens);
      }
    } else {
      address = await this.ethers.resolveName(addressOrEns);
      if (!address) {
        throw new NameNotFoundError();
      }
      avatar = await this.ethers.getAvatar(addressOrEns);
    }
    const user = await this.user.findFirst({ where: { address } });
    return { ens, address, avatar, user };
  }
}
