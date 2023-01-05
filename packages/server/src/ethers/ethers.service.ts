import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { ethers } from 'ethers';
import { AppEnv, Config } from '../config/config';

@Injectable()
export class EthersService implements OnModuleInit {
  private readonly logger = new Logger(EthersService.name);

  public network: string;
  public provider: ethers.providers.WebSocketProvider;
  public zeroAddress = ethers.constants.AddressZero;

  constructor(
    private configService: ConfigService<Config>,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {
    const appEnv = this.configService.get('appEnv');
    if (appEnv === AppEnv.production) {
      this.network = 'mainnet';
    } else if (appEnv === AppEnv.development || appEnv === AppEnv.staging) {
      this.network = 'goerli';
    } else if (appEnv === AppEnv.test) {
      this.network = 'localhost';
    } else {
      throw new Error('App environment unknown');
    }
  }

  async onModuleInit() {
    this.initWS();
  }

  initWS() {
    const logMessage = `Creating WS provider on network: ${this.network}`;
    this.logger.log(logMessage);
    this.sentryClient.instance().captureMessage(logMessage);

    if (this.configService.get('appEnv') === AppEnv.test) {
      this.provider = new ethers.providers.WebSocketProvider(
        `ws://127.0.0.1:8545`,
      );
    } else {
      this.provider = new ethers.providers.WebSocketProvider(
        this.configService.get('alchemy').wsEndpoint,
        this.network,
      );
    }
    // this.eventEmitter.emit(Events.ETHERS_WS_PROVIDER_CONNECTED, this.provider);

    if (this.configService.get('appEnv') !== AppEnv.test) {
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

  getEnsName(address: string) {
    return this.provider.lookupAddress(address);
  }

  async getDateTimeFromBlockNumber(blockNumber: number) {
    const block = await this.provider.getBlock(blockNumber);
    return new Date(block.timestamp * 1000);
  }

  getAvatar(ens: string) {
    return this.provider.getAvatar(ens);
  }
}
