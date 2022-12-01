import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findMany(args?: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany(args);
  }
}
