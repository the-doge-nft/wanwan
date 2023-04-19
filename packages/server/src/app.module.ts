import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SentryModule } from '@travelerdev/nestjs-sentry';
import { redisStore } from 'cache-manager-redis-yet';
import { AlchemyService } from './alchemy/alchemy.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CacheService } from './cache/cache.service';
import { CommentService } from './comment/comment.service';
import { CompetitionCuratorService } from './competition-curator/competition-curator.service';
import { CompetitionSearchService } from './competition/competition-search.service';
import { CompetitionController } from './competition/competition.controller';
import { CompetitionService } from './competition/competition.service';
import config, { Config } from './config/config';
import { CurrencyService } from './currency/currency.service';
import { EthersService } from './ethers/ethers.service';
import { MediaService } from './media/media.service';
import { MemeSearchService } from './meme/meme-search.service';
import { MemeController } from './meme/meme.controller';
import { MemeService } from './meme/meme.service';
import { PrismaService } from './prisma.service';
import { ProfileService } from './profile/profile.service';
import { RewardService } from './reward/reward.service';
import { S3Service } from './s3/s3.service';
import { StatsService } from './stats/stats.service';
import { SubmissionService } from './submission/submission.service';
import { TwitterController } from './twitter/twitter.controller';
import { TwitterService } from './twitter/twitter.service';
import { UserService } from './user/user.service';
import { VoteService } from './vote/vote.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ScheduleModule.forRoot(),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService<Config>) => {
        Logger.log(`Sentry DSN: ${config.get('sentry').dns}`);
        return {
          dsn: config.get('sentry').dns,
          debug: true,
          logLevels: ['log', 'error', 'warn', 'debug', 'verbose'],
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync<any>({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService<Config>) => {
        const store = await redisStore({
          url: config.get('redisUrl'),
          ttl: 0,
        });
        return {
          store: () => store,
        };
      },
    }),
    AuthModule,
    HttpModule,
  ],
  controllers: [
    AppController,
    MemeController,
    CompetitionController,
    TwitterController,
  ],
  providers: [
    PrismaService,
    UserService,
    S3Service,
    MediaService,
    MemeService,
    CompetitionService,
    CommentService,
    SubmissionService,
    VoteService,
    AlchemyService,
    RewardService,
    CurrencyService,
    CompetitionCuratorService,
    ProfileService,
    EthersService,
    CompetitionSearchService,
    MemeSearchService,
    StatsService,
    CacheService,
    AppService,
    TwitterService,
  ],
})
export class AppModule {}
