import { Injectable } from '@nestjs/common';
import { MemeService } from 'src/meme/meme.service';
import { EthersService } from './../ethers/ethers.service';
import {
  formatEthereumAddress,
  isValidEthereumAddress,
} from './../helpers/strings';
import { UserService } from './../user/user.service';

export class NameNotFoundError extends Error {
  constructor() {
    super('Invalid name');
  }
}

@Injectable()
export class ProfileService {
  constructor(
    private readonly ethers: EthersService,
    private readonly user: UserService,
    private readonly meme: MemeService,
  ) {}
  async get(addressOrEns: string) {
    const isAddress = isValidEthereumAddress(addressOrEns);
    let avatar: null | string;
    let ens: null | string = addressOrEns;
    let address: string;
    if (isAddress) {
      address = formatEthereumAddress(addressOrEns);
      ens = await this.ethers.getCachedEnsName(address);
      if (ens) {
        avatar = await this.ethers.getCachedAvatar(ens);
      }
    } else {
      address = await this.ethers.resolveName(addressOrEns);
      if (!address) {
        throw new NameNotFoundError();
      }
      avatar = await this.ethers.getCachedAvatar(addressOrEns);
    }
    const user = await this.user.findFirst({ where: { address } });
    const memes = await this.meme.findMany({
      where: { user: { address } },
      orderBy: { createdAt: 'desc' },
    });
    const wan = await this.user.getWanScore(address);
    return { address, avatar, user, memes, wan };
  }
}
