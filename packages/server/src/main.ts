import { Logger } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Config } from './config/config';
import { getExpressRedisSession } from './middleware/session';
import getValidationPipe from './middleware/validation';
import { PrismaService } from './prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const config = app.get<ConfigService>(ConfigService<Config>);
  const isProd = config.get('isProd');
  app.use(getExpressRedisSession(app));
  app.useGlobalPipes(getValidationPipe());

  const corsConfig: CorsOptions = {
    origin: [
      'http://127.0.0.1:3001',
      'http://localhost:3001',
      'https://test.wanwan.me',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
  };
  if (isProd) {
    corsConfig.origin = /\.wanwan\.me$/;
  }
  app.enableCors(corsConfig);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Wan Wan')
    .setDescription('Wan Wan API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = config.get('port');
  Logger.log(`[APP] listening on port: ${port}`);
  await app.listen(port);
}

bootstrap();
