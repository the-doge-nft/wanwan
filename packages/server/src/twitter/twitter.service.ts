import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SendTweetV2Params,
  TUploadableMedia,
  TwitterApi,
  UploadMediaV1Params,
} from 'twitter-api-v2';
import { Config } from '../config/config';

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);
  private readonly appClient: TwitterApi;
  private readonly callbackUrl: string;

  constructor(private readonly config: ConfigService<Config>) {
    const twitterConfig = this.config.get<Config['twitter']>('twitter');
    this.appClient = this.createClient(
      twitterConfig.accessToken,
      twitterConfig.accessTokenSecret,
    );
    this.callbackUrl = 'https://wanwan.me/twitter';
    if (this.config.get('isDev')) {
      this.callbackUrl = 'http://localhost:3001/twitter';
    } else if (this.config.get('isStaging')) {
      this.callbackUrl = 'https://test.wanwan.me/twitter';
    }
  }

  getMyUser(client: TwitterApi) {
    return client.currentUser();
  }

  getAuthLink() {
    return this.appClient.generateAuthLink(this.callbackUrl, {
      linkMode: 'authorize',
    });
  }

  uploadMedia(file: TUploadableMedia, options?: Partial<UploadMediaV1Params>) {
    return this.appClient.v1.uploadMedia(file, options);
  }

  tweet(payload: SendTweetV2Params) {
    return this.appClient.v2.tweet(payload);
  }

  reply(
    status: string,
    toTweetId: string,
    payload?: Partial<SendTweetV2Params>,
  ) {
    return this.appClient.v2.reply(status, toTweetId, payload);
  }

  loginUser({
    oauthVerifier,
    accessToken,
    accessSecret,
  }: {
    oauthVerifier: string;
    accessToken: string;
    accessSecret: string;
  }) {
    const client = this.createClient(accessToken, accessSecret);
    return client.login(oauthVerifier);
  }

  private createClient(accessToken: string, accessSecret: string) {
    const twitterConfig = this.config.get('twitter');
    return new TwitterApi({
      appKey: twitterConfig.consumerKey,
      appSecret: twitterConfig.consumerSecret,
      accessToken,
      accessSecret,
    });
  }
}
