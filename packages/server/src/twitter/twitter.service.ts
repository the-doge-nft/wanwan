import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApi } from 'twitter-api-v2';
import { Config } from '../config/config';

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);
  public readonly appClient: TwitterApi;

  constructor(private readonly config: ConfigService<Config>) {
    const twitterConfig = this.config.get('twitter');
    this.appClient = new TwitterApi({
      appKey: twitterConfig.consumerKey,
      appSecret: twitterConfig.consumerSecret,
      accessToken: twitterConfig.accessToken,
      accessSecret: twitterConfig.accessTokenSecret,
    });
  }

  // requestAccessToken(authClient: auth.OAuth2User, code: string): Promise<any> {
  //   return authClient.requestAccessToken(code);
  // }

  getMyUser(client: TwitterApi) {
    return client.currentUser();
  }

  createAuthClient() {
    // return new auth.OAuth2User({
    //   client_id: this.config.get('twitter').clientId,
    //   client_secret: this.config.get('twitter').clientSecret,
    //   callback: 'http://localhost:3001/twitter',
    //   scopes: ['tweet.read', 'users.read', 'offline.access'],
    // });
  }

  // createClient(authClient: auth.OAuth2User = this.createAuthClient()) {
  //   console.log(
  //     `debug:: access token: ${this.config.get('twitter').accessToken}`,
  //   );
  //   const _authClient = new auth.OAuth2User({
  //     token: this.config.get('twitter').accessTokenSecret,
  //     client_id: this.config.get('twitter').clientId,
  //     client_secret: this.config.get('twitter').clientSecret,
  //     scopes: ['tweet.write', 'offline.access'],
  //     callback: 'http://localhost:3001/twitter',
  //   });

  //   return new Client(_authClient);
  // }
}
