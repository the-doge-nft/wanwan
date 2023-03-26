import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Client, { auth } from 'twitter-api-sdk';
import { Config } from '../config/config';

@Injectable()
export class TwitterService {
  constructor(private readonly config: ConfigService<Config>) {}

  requestAccessToken(authClient: auth.OAuth2User, code: string): Promise<any> {
    return authClient.requestAccessToken(code);
  }

  getMyUser(client: Client) {
    return client.users.findMyUser();
  }

  createAuthClient() {
    return new auth.OAuth2User({
      client_id: this.config.get('twitter').clientId,
      client_secret: this.config.get('twitter').clientSecret,
      callback: 'http://localhost:3001/twitter',
      scopes: ['tweet.read', 'users.read', 'offline.access'],
    });
  }

  createClient(authClient: auth.OAuth2User = this.createAuthClient()) {
    return new Client(authClient);
  }
}
