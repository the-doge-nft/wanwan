import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { RewardStatus, SocialPlatform } from '@prisma/client';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { lookup } from 'mime-types';
import { CompetitionService } from './competition/competition.service';
import { EthersService } from './ethers/ethers.service';
import { abbreviate } from './helpers/strings';
import { MemeService } from './meme/meme.service';
import { PrismaService } from './prisma.service';
import { RewardService } from './reward/reward.service';
import { TwitterService } from './twitter/twitter.service';
import { UserService } from './user/user.service';

export enum CronJobs {
  VALIDATE_CONFIRMING_REWARDS = 'validateConfirmingRewards',
}

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private readonly WAN_WAN_TWITTER_NAME = 'wanwandotme';

  constructor(
    private readonly ethers: EthersService,
    private readonly prisma: PrismaService,
    private readonly meme: MemeService,
    private readonly twitter: TwitterService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly competition: CompetitionService,
    private readonly user: UserService,
    private readonly reward: RewardService,
    @InjectSentry() private readonly sentryClient: SentryService,
    private readonly scheduler: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    this.logger.log('app service init');
    this.cacheEnsNames();
  }

  getIndex(): string {
    return `🗣️ wan:wan 🗣️`;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cacheEnsNames() {
    const addresses = await this.getAddresses();
    this.logger.log(`Caching ${addresses.length} ens names`);
    for (const address of addresses) {
      try {
        const ens = await this.ethers.refreshEnsCache(address);
        await this.user.update({ where: { address }, data: { ens } });

        await this.ethers.refreshAvatarCache(address);
      } catch (e) {
        this.logger.error(e);
        this.sentryClient.instance().captureException(e);
      }
    }
    this.logger.log(`Done caching ${addresses.length} ens names`);
    return addresses;
  }

  @Cron(CronExpression.EVERY_3_HOURS)
  async tweetMeme() {
    const memeSharedIds = await this.prisma.socialMemeShares.findMany({
      select: { memeId: true },
    });
    const meme = await this.meme.findFirst({
      orderBy: { createdAt: 'asc' },
      where: { id: { notIn: memeSharedIds.map((share) => share.memeId) } },
      take: 1,
    });

    if (!meme) {
      this.logger.log('No memes found to tweet');
      return;
    }

    try {
      const url = meme.media.url;
      const extension = url.split('.').pop();
      const mimeType = lookup(extension);
      const response = await this.http.axiosRef.get(url, {
        responseType: 'arraybuffer',
      });

      const mediaId = await this.twitter.uploadMedia(response.data, {
        mimeType,
      });

      const tweet = await this.twitter.tweet({
        media: {
          media_ids: [mediaId],
        },
      });

      let displayName = abbreviate(meme.user.address);
      if (meme.user.twitterUsername) {
        displayName = `@${meme.user.twitterUsername}`;
      } else if (meme.user.ens) {
        displayName = meme.user.ens;
      }

      const replyText = `created by ${displayName} | link: ${this.config.get(
        'baseUrl',
      )}/meme/${meme.id}`;
      const reply = await this.twitter.reply(replyText, tweet.data.id);
      await this.prisma.socialMemeShares.create({
        data: { memeId: meme.id, platform: SocialPlatform.Twitter },
      });

      this.logger.log(`tweetd meme: ${meme.id}`);
      return { meme, tweet, reply };
    } catch (e) {
      this.logger.error(e);
      this.sentryClient.instance().captureException(e);
    }
  }

  private async getAddresses() {
    const users = await this.prisma.user.findMany({
      select: { address: true },
    });
    return users.map((user) => user.address);
  }

  async search(search: string) {
    const take = 5;
    const memes = await this.meme.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      take,
    });
    const competitions = await this.competition.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      take,
    });
    const users = await this.user.findMany({
      where: {
        OR: [
          {
            address: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            ens: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      take,
    });
    return { memes, competitions, users };
  }

  // @note -- this might be a bit of a burden on the DB but leaving for now
  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: CronJobs.VALIDATE_CONFIRMING_REWARDS,
  })
  async updateConfirmingTxs() {
    this.logger.log(`validting confirming txs`);
    const confirmingRewards = await this.reward.findMany({
      where: { status: RewardStatus.CONFIRMING },
    });
    this.logger.log(`got ${confirmingRewards.length} confirming txs`);

    for (const reward of confirmingRewards) {
      if (!reward.txId) {
        this.logger.error(`Reward ${reward.id} has no txId`);
        continue;
      }
      try {
        await this.reward.getIsRewardTxValid(reward.id, reward.txId);
        await this.reward.update({
          where: { id: reward.id },
          data: { status: RewardStatus.CONFIRMED },
        });
      } catch (e) {
        this.logger.error(`Error updating confirming tx ${reward.txId}`);
        this.sentryClient.instance().captureException(e);
        await this.reward.update({
          where: { id: reward.id },
          data: { status: RewardStatus.FAILED },
        });
      }
    }
  }
}
