import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import { createClient } from 'redis';
import { Config } from './../config/config';

export function getExpressRedisSession(app: INestApplication): any {
  const configService = app.get<ConfigService>(ConfigService<Config>);
  const url = configService.get('redisUrl');
  const sessionConfig = configService.get<Config['session']>('session');
  Logger.log(`[REDIS SESSION] connecting -- url string: ${url}`);
  const redisClient = createClient({
    url,
    legacyMode: false,
  });

  redisClient
    .connect()
    .then(() => Logger.log('[REDIS SESSION] connected'))
    .catch((e) => Logger.error(`[REDIS SESSION] ${e}`));

  const store = new RedisStore({
    client: redisClient,
    // logErrors: true,
  });
  return session({
    store,
    name: sessionConfig.name,
    secret: sessionConfig.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: 'lax',
      httpOnly: true,
    },
  });
}
