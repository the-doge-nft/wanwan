import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Config } from './config/config';
import { getExpressRedisSession } from './middleware/session';
import getValidationPipe from './middleware/validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(getExpressRedisSession(app));
  app.useGlobalPipes(getValidationPipe());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Meme2Earn')
    .setDescription('Meme2Earn API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = app.get<ConfigService>(ConfigService<Config>).get('port');
  Logger.log(`[APP] listening on port: ${port}`);
  await app.listen(port);
}

bootstrap();
