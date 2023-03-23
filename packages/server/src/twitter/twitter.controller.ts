import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthenticatedRequest } from './../interface/index';
import { ProfileService } from './../profile/profile.service';
import { UserService } from './../user/user.service';
import { TwitterService } from './twitter.service';

@Controller('twitter')
export class TwitterController {
  private readonly STATE = 'test-state';

  constructor(
    private readonly twitter: TwitterService,
    private readonly user: UserService,
    private readonly profile: ProfileService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('callback')
  async postCallback(
    @Body() { code, state }: { code: string; state: string },
    @Req() { user }: AuthenticatedRequest,
  ) {
    if (state !== this.STATE) {
      throw new BadRequestException('Wrong state');
    }
    await this.twitter.requestAccessToken(code);
    const twitterUser = await this.twitter.getMyUser();
    console.log(twitterUser);
    await this.user.update({
      where: { id: user.id },
      data: { twitterUsername: twitterUser.data.username },
    });
    return this.profile.get(user.address);
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

  @UseGuards(AuthGuard)
  @Post('delete')
  async deleteTwitter(@Req() { user }: AuthenticatedRequest) {
    await this.user.update({
      where: { id: user.id },
      data: {
        twitterUsername: null,
      },
    });
    return this.profile.get(user.address);
  }
}
