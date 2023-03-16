import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Client, { auth } from 'twitter-api-sdk';
import { GenerateAuthUrlOptions } from 'twitter-api-sdk/dist/OAuth2User';
import { Config } from '../config/config';

@Injectable()
export class TwitterService {
  private readonly client: Client;
  private readonly authClient: auth.OAuth2User;

  constructor(private readonly config: ConfigService<Config>) {
    this.authClient = new auth.OAuth2User({
      client_id: this.config.get('twitter').clientId,
      client_secret: this.config.get('twitter').clientSecret,
      callback: 'http://127.0.0.1:3000/twitter/callback',
      scopes: ['tweet.read', 'users.read', 'offline.access'],
    });
    this.client = new Client(this.authClient);
  }

  requestAccessToken(code: string): Promise<any> {
    return this.authClient.requestAccessToken(code);
  }

  generateAuthUrl(options: GenerateAuthUrlOptions) {
    return this.authClient.generateAuthURL(options);
  }
}
