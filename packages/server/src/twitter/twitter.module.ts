import { Module } from '@nestjs/common';
import { TwitterController } from './twitter.controller';
import { TwitterService } from './twitter.service';

@Module({
  providers: [TwitterService],
  controllers: [TwitterController],
})
export class TwitterModule {}
