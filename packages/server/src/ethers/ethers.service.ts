import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { AppEnv, Config } from '../config/config';
import { CacheService } from './../cache/cache.service';

@Injectable()
export class EthersService {
  private readonly logger = new Logger(EthersService.name);
  private secondsToCacheEns = 60 * 60 * 10;

  public network: string;
  public provider: ethers.providers.AlchemyProvider;
  public zeroAddress = ethers.constants.AddressZero;

  private getEnsCacheKey(address: string) {
    return `ens:${address.toLowerCase()}`;
  }

  constructor(
    private readonly config: ConfigService<Config>,
    private readonly cache: CacheService,
  ) {
    const appEnv = this.config.get('appEnv');
    if (appEnv === AppEnv.production) {
      this.network = 'mainnet';
    } else if (appEnv === AppEnv.development || appEnv === AppEnv.staging) {
      this.network = 'goerli';
    } else if (appEnv === AppEnv.test) {
      this.network = 'localhost';
    } else {
      this.logger.error('App environment unknown');
      throw new Error('App environment unknown');
    }
    this.provider = new ethers.providers.AlchemyProvider(
      this.network,
      this.config.get('alchemy').apiKey,
    );
  }

  async refreshEnsCache(address: string) {
    const ens = await this.getEnsName(address);
    return this.cache.set(
      this.getEnsCacheKey(address),
      ens,
      this.secondsToCacheEns,
    );
  }

  getCachedEnsName(address: string) {
    return this.cache.get<string>(this.getEnsCacheKey(address));
  }

  getEnsName(address: string) {
    return this.provider.lookupAddress(address);
  }

  resolveName(ens: string) {
    return this.provider.resolveName(ens);
  }

  async getDateTimeFromBlockNumber(blockNumber: number) {
    const block = await this.provider.getBlock(blockNumber);
    return new Date(block.timestamp * 1000);
  }

  getAvatar(ens: string) {
    return this.provider.getAvatar(ens);
  }
}
