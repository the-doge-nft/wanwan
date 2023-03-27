import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthenticatedRequest } from './../interface/index';
import { ProfileService } from './../profile/profile.service';
import { UserService } from './../user/user.service';
import { TwitterService } from './twitter.service';

@Controller('twitter')
export class TwitterController {
  private readonly logger = new Logger();
  private readonly STATE = 'test-state';
  // private readonly oauthClients = new Map<string, auth.OAuth2User>();

  constructor(
    private readonly twitter: TwitterService,
    private readonly user: UserService,
    private readonly profile: ProfileService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('callback')
  async postCallback(
    @Body() { code, state }: { code: string; state: string },
    @Req() { user }: AuthenticatedRequest,
  ) {
    // if (state !== this.STATE) {
    //   throw new BadRequestException('Wrong state');
    // }

    // try {
    //   const authClient = this.oauthClients.get(user.address);
    //   await this.twitter.requestAccessToken(authClient, code);
    //   const client = this.twitter.createClient(authClient);
    //   const twitterUser = await this.twitter.getMyUser(client);
    //   await this.user.update({
    //     where: { id: user.id },
    //     data: { twitterUsername: twitterUser.screen_name },
    //   });
    //   await authClient.revokeAccessToken();
    //   this.oauthClients.delete(user.address);
    //   return this.profile.get(user.address);
    // } catch (e) {
    //   this.logger.error(e);
    //   this.sentryClient.instance().captureException(e);
    //   throw new BadRequestException('Could not authenticate with Twitter.');
    // }
    return {};
  }

  @UseGuards(AuthGuard)
  @Get('login')
  @Redirect('')
  async getLogin(@Req() { user }: AuthenticatedRequest) {
    // const authClient = this.twitter.createAuthClient();
    // const url = authClient.generateAuthURL({
    //   state: this.STATE,
    //   code_challenge_method: 's256',
    // });
    // this.oauthClients.set(user.address, authClient);
    const url = '';
    return {
      url,
    };
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
    // if (this.oauthClients.get(user.address)) {
    //   this.oauthClients.delete(user.address);
    // }
    return this.profile.get(user.address);
  }
}
