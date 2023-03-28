import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lookup } from 'mime-types';
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
    private readonly config: ConfigService,
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
      const extension = url.split('.').pop();
      const mimeType = lookup(extension);
      const response = await this.http.axiosRef.get(url, {
        responseType: 'arraybuffer',
      });

      // const mediaId = await this.twitter.uploadMedia(response.data, {
      //   mimeType,
      // });
      // console.log('media::', mediaId);

      // const tweet = await this.twitter.tweet({
      //   text: 'wow this is another cool meme',
      //   media: {
      //     media_ids: [mediaId],
      //   },
      // });
      // console.log('tweet::', tweet);

      // const replyText = `created by ${
      //   meme.user.ens ? meme.user.ens : meme.user.address
      // } on ${this.config.get('baseUrl')}/meme/${meme.id}`;
      // const reply = await this.twitter.reply(replyText, tweet.data.id);
      // console.log('reply::', reply);

      // await this.prisma.socialMemeShares.create({
      //   data: { memeId: meme.id, platform: SocialPlatform.Twitter },
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
