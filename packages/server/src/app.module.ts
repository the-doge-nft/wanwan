import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SentryModule } from '@travelerdev/nestjs-sentry';
import { redisStore } from 'cache-manager-redis-store';
import { AlchemyService } from './alchemy/alchemy.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommentService } from './comment/comment.service';
import { CompetitionCuratorService } from './competition-curator/competition-curator.service';
import { CompetitionController } from './competition/competition.controller';
import { CompetitionService } from './competition/competition.service';
import config, { Config } from './config/config';
import { CurrencyService } from './currency/currency.service';
import { EthersService } from './ethers/ethers.service';
import { MediaService } from './media/media.service';
import { MemeController } from './meme/meme.controller';
import { MemeService } from './meme/meme.service';
import { PrismaService } from './prisma.service';
import { ProfileService } from './profile/profile.service';
import { RewardService } from './reward/reward.service';
import { S3Service } from './s3/s3.service';
import { SubmissionService } from './submission/submission.service';
import { UserService } from './user/user.service';
import { VoteService } from './vote/vote.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService<Config>) => ({
        dsn: config.get('sentry').dns,
        debug: true,
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync<any>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<Config>) => {
        const redisConfig = await configService.get('redis');
        const store = await redisStore({
          ttl: 60,
          password: redisConfig.password,
          socket: {
            host: redisConfig.host,
            port: redisConfig.port,
            passphrase: redisConfig.password,
            rejectUnauthorized: true,
          },
        });
        return { store: () => store };
      },
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController, MemeController, CompetitionController],
  providers: [
    AppService,
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
    // Search,
  ],
})
export class AppModule {}
