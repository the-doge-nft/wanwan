import { Module } from '@nestjs/common';
import { CacheService } from './../cache/cache.service';
import { EthersService } from './../ethers/ethers.service';
import { PrismaService } from './../prisma.service';
import { UserService } from './../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [
    AuthService,
    UserService,
    PrismaService,
    EthersService,
    CacheService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
