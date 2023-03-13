import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { ethers } from 'ethers';
import { AppEnv, Config } from '../config/config';
import { CacheService } from './../cache/cache.service';

@Injectable()
export class EthersService implements OnModuleInit {
  private readonly logger = new Logger(EthersService.name);

  public network: string;
  public provider: ethers.providers.WebSocketProvider;
  public zeroAddress = ethers.constants.AddressZero;

  private getEnsCacheKey(address: string) {
    return `ens:${address.toLowerCase()}`;
  }

  constructor(
    private readonly config: ConfigService<Config>,
    private readonly cache: CacheService,
    @InjectSentry() private readonly sentryClient: SentryService,
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
  }

  async onModuleInit() {
    try {
      this.logger.log('ethers service init');
      this.initWS();
    } catch (e) {
      console.error(e);
    }
  }

  initWS() {
    const logMessage = `Creating WS provider on network: ${
      this.network
    }:${this.config.get('appEnv')}`;
    this.logger.log(logMessage);
    this.sentryClient.instance().captureMessage(logMessage);

    if (this.config.get('appEnv') === AppEnv.test) {
      this.provider = new ethers.providers.WebSocketProvider(
        `ws://127.0.0.1:8545`,
      );
    } else {
      this.provider = new ethers.providers.WebSocketProvider(
        this.config.get('alchemy').wsEndpoint,
        this.network,
      );
    }
    // this.eventEmitter.emit(Events.ETHERS_WS_PROVIDER_CONNECTED, this.provider);

    if (this.config.get('appEnv') !== AppEnv.test) {
      this.keepAlive({
        provider: this.provider,
        onDisconnect: () => {
          this.initWS();
        },
      });
    }
  }

  // ws connection will randomly drop, this makes sure we are always connected
  keepAlive({
    provider,
    onDisconnect,
    expectedPongBack = 15000,
    checkInterval = 7500,
  }: any) {
    let pingTimeout: any;
    let keepAliveInterval: any;

    provider._websocket.on('open', () => {
      const logMessage = 'Ethers provider ws connection open';
      this.logger.log(logMessage);
      keepAliveInterval = setInterval(() => {
        provider._websocket.ping();

        pingTimeout = setTimeout(() => {
          provider._websocket.terminate();
        }, expectedPongBack);
      }, checkInterval);
    });

    provider._websocket.on('close', (err) => {
      const logMessage = 'Ethers provider ws connection closed';
      this.logger.error(logMessage);
      this.sentryClient.instance().captureMessage(logMessage);

      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }

      if (pingTimeout) {
        clearTimeout(pingTimeout);
      }

      onDisconnect(err);
    });

    provider._websocket.on('pong', () => {
      if (pingTimeout) {
        clearTimeout(pingTimeout);
      }
    });
  }

  async refreshEnsCache(address: string) {
    const ens = await this.getEnsName(address);
    return this.cache.set(this.getEnsCacheKey(address), ens, 60 * 60 * 2);
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
