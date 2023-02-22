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
  Logger.log(
    `[REDIS SESSION] connecting -- host: ${redisConfig.host}, port: ${redisConfig.port}, password: ${redisConfig.password}}`,
  );
  const redisClient = createClient({
    socket: {
      host: redisConfig.host,
      port: redisConfig.port,
      tls: !configService.get('isDev'),
    },
    password: redisConfig.password,
  });
  redisClient
    .connect()
    .then(() => Logger.log('[REDIS SESSION] connected'))
    .catch((e) => Logger.error(`[REDIS SESSION] ${e}`));
  const RedisStore = createRedisStore(session);
  return session({
    store: new RedisStore({ client: redisClient }),
    name: sessionConfig.name,
    secret: sessionConfig.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: true,
    },
  });
}
