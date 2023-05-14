import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Redirect,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { SessionType } from 'src/auth/auth.controller';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthenticatedRequest } from './../interface/index';
import { UserService } from './../user/user.service';
import { TwitterService } from './twitter.service';

@Controller('twitter')
export class TwitterController {
  private readonly logger = new Logger();

  constructor(
    private readonly twitter: TwitterService,
    private readonly user: UserService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('callback')
  async postCallback(
    @Body()
    {
      oauth_token,
      oauth_verifier,
    }: { oauth_token: string; oauth_verifier: string },
    @Req() { user }: AuthenticatedRequest,
    @Session() session: SessionType,
  ) {
    if (!oauth_token || !oauth_verifier || !session.oauth_token_secret) {
      throw new BadRequestException(
        'Token, secret, or verifier missing for twitter auth',
      );
    }

    try {
      const { client } = await this.twitter.loginUser({
        oauthVerifier: oauth_verifier,
        accessToken: oauth_token,
        accessSecret: session.oauth_token_secret,
      });
      const twitterUser = await client.currentUserV2();
      await this.user.update({
        where: { id: user.id },
        data: { twitterUsername: twitterUser.data.username },
      });
    } catch (e) {
      this.logger.error(e);
      this.sentryClient.instance().captureException(e);
      throw new BadRequestException('Could not auth with twitter');
    }

    session.oauth_token_secret = undefined;
    return this.user.findFirst({ where: { address: user.address } });
  }

  @UseGuards(AuthGuard)
  @Get('login')
  @Redirect('')
  async getLogin(@Session() session: SessionType) {
    const authLink = await this.twitter.getAuthLink();
    session.oauth_token_secret = authLink.oauth_token_secret;
    return { url: authLink.url };
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
    return this.user.findFirst({ where: { address: user.address } });
  }
}
