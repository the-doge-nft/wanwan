import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(
  //   session({
  //     secret: 'my-secret',
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: {
  //       secure: false,
  //     },
  //   }),
  // );
  const port = app.get(ConfigService).get('port');
  Logger.log(`listeneing on port: ${port}`);
  await app.listen(port);
}
bootstrap();
