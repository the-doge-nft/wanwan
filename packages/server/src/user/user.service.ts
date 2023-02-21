import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  count(args?: Prisma.UserCountArgs) {
    return this.prisma.user.count(args);
  }

  upsert(args?: Prisma.UserUpsertArgs) {
    return this.prisma.user.upsert(args);
  }

  findMany(args?: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany(args);
  }

  findFirst(args?: Prisma.UserFindFirstArgs) {
    return this.prisma.user.findFirst(args);
  }
}
