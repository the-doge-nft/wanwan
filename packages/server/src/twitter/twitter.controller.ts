import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthenticatedRequest } from './../interface/index';
import { TwitterService } from './twitter.service';

@Controller('twitter')
export class TwitterController {
  private readonly STATE = 'test-state';

  constructor(private readonly twitter: TwitterService) {}

  @UseGuards(AuthGuard)
  @Get('callback')
  async postCallback(
    @Query() { code, state }: { code: string; state: string },
    @Req() { user }: AuthenticatedRequest,
  ) {
    console.log(code, state);
    if (state !== this.STATE) {
      throw new BadRequestException('Wrong state');
    }
    await this.twitter.requestAccessToken(code);
    const user = await this.twitter.getMyUser();
    return { success: true, user };
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
