import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Redirect,
} from '@nestjs/common';
import { TwitterService } from './twitter.service';

@Controller('twitter')
export class TwitterController {
  private readonly STATE = 'test-state';

  constructor(private readonly twitter: TwitterService) {}

  @Get('callback')
  async postCallback(
    @Query() { code, state }: { code: string; state: string },
  ) {
    console.log(code, state);
    if (state !== this.STATE) {
      throw new BadRequestException('Wrong state');
    }
    await this.twitter.requestAccessToken(code);
    return { success: true };
  }

  @Get('login')
  @Redirect('')
  async getLogin() {
    const url = this.twitter.generateAuthUrl({
      state: this.STATE,
      code_challenge_method: 's256',
    });
    return { url };
  }
}
