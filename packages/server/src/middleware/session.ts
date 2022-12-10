import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as createRedisStore from 'connect-redis';
import * as session from 'express-session';
import { createClient } from 'redis';
import { Config } from './../config/config';

export function getExpressRedisSession(app: INestApplication): any {
  const configService = app.get<ConfigService>(ConfigService<Config>);
  const redisConfig = configService.get<Config['redis']>('redis');
  const sessionConfig = configService.get<Config['session']>('session');

  const redisClient = createClient({
    url: `redis://:${redisConfig.password}@${redisConfig.host}:${redisConfig.port}`,
    legacyMode: true,
  });
  redisClient.connect().catch(Logger.error);
  const RedisStore = createRedisStore(session);
  return session({
    store: new RedisStore({ client: redisClient }),
    name: sessionConfig.name,
    secret: sessionConfig.secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,
      sameSite: true,
    },
  });
}
