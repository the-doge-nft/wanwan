import { Module } from '@nestjs/common';
import { TwitterController } from './twitter.controller';
import { TwitterService } from './twitter.service';

@Module({})
export class TwitterModule {
  controllers: [TwitterController];
  providers: [TwitterService];
}
