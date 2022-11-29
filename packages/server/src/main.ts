import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as createRedisStore from 'connect-redis';
import * as session from 'express-session';
import { createClient } from 'redis';
import { AppModule } from './app.module';
import { Configuration } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Configuration>);

  const redisConfig = configService.get<Configuration['redis']>('redis');
  const redisClient = createClient({
    url: `redis://:${redisConfig.password}@${redisConfig.host}:${redisConfig.port}`,
    legacyMode: true,
  });
  redisClient.connect().catch(Logger.error);
  const RedisStore = createRedisStore(session);
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      name: 'meme-api-test',
      secret: 'my-secret',
      resave: true,
      saveUninitialized: true,
      cookie: {
        secure: false,
        sameSite: true,
      },
    }),
  );

  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get('port');
  Logger.log(`listening on port: ${port}`);
  await app.listen(port);
}
bootstrap();
