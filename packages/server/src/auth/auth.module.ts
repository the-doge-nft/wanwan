import { Module } from '@nestjs/common';
import { PrismaService } from './../prisma.service';
import { UserService } from './../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, UserService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
