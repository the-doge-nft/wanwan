import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from './config/config';
import { getExpressRedisSession } from './middleware/session';
import getValidationPipe from './middleware/validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(getExpressRedisSession(app));
  app.useGlobalPipes(getValidationPipe());

  const port = app.get<ConfigService>(ConfigService<Config>).get('port');
  Logger.log(`listening on port: ${port}`);
  await app.listen(port);
}

bootstrap();
