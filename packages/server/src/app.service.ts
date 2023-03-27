import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EthersService } from './ethers/ethers.service';
import { MemeService } from './meme/meme.service';
import { PrismaService } from './prisma.service';
import { TwitterService } from './twitter/twitter.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly ethers: EthersService,
    private readonly prisma: PrismaService,
    private readonly meme: MemeService,
    private readonly twitter: TwitterService,
    private readonly http: HttpService,
  ) {}

  onModuleInit() {
    this.logger.log('app service init');
    this.cacheEnsNames();
    this.tweetMeme();
  }

  getIndex(): string {
    return `🗣️ wan,wan 🗣️`;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cacheEnsNames() {
    const addresses = await this.getAddresses();
    this.logger.log(`Caching ${addresses.length} ens names`);
    for (const address of addresses) {
      try {
        await this.ethers.refreshEnsCache(address);
      } catch (e) {}
    }
    return addresses;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async tweetMeme() {
    const memeSharedIds = await this.prisma.socialMemeShares.findMany({
      select: { memeId: true },
    });
    const meme = await this.meme.findFirst({
      orderBy: { createdAt: 'desc' },
      where: { id: { notIn: memeSharedIds.map((share) => share.memeId) } },
      include: { user: true },
      take: 1,
    });

    this.logger.log('testing out creating tweet');
    try {
      const url = meme.media.url;
      // const image = this.http.axiosRef.get(url)
      console.log('url', url);
      // const media = await this.twitter.appClient.v1.uploadMedia();

      // await this.twitter.appClient.v2.tweet({
      //   text: 'testing this outtt',
      //   media: {},
      // });
    } catch (e) {
      console.log(e);
      this.logger.error(e);
    }
  }

  private async getAddresses() {
    const users = await this.prisma.user.findMany({
      select: { address: true },
    });
    return users.map((user) => user.address);
  }
}
