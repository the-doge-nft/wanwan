import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import config, { Config } from './config/config';
import { PrismaService } from './prisma.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { S3Service } from './s3/s3.service';
import { MediaService } from './media/media.service';
import { MemeService } from './meme/meme.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    CacheModule.registerAsync<any>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<Config>) => {
        const redisConfig = await configService.get('redis');
        const store = await redisStore({
          ttl: 60,
          password: redisConfig.password,
          socket: {
            host: redisConfig.host,
            port: redisConfig.port,
            passphrase: redisConfig.password,
            rejectUnauthorized: true,
          },
        });
        return { store: () => store };
      },
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, PrismaService, UserService, S3Service, MediaService, MemeService],
})
export class AppModule {}
