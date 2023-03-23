import { Module } from '@nestjs/common';
import { MediaService } from '../media/media.service';
import { MemeService } from '../meme/meme.service';
import { ProfileService } from '../profile/profile.service';
import { UserService } from '../user/user.service';
import { CacheService } from './../cache/cache.service';
import { EthersService } from './../ethers/ethers.service';
import { PrismaService } from './../prisma.service';
import { S3Service } from './../s3/s3.service';
import { TwitterController } from './twitter.controller';
import { TwitterService } from './twitter.service';

@Module({
  providers: [
    TwitterService,
    UserService,
    PrismaService,
    EthersService,
    CacheService,
    ProfileService,
    MemeService,
    MediaService,
    S3Service,
  ],
  controllers: [TwitterController],
})
export class TwitterModule {}
