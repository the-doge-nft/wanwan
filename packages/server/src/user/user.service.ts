import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  upsert(args?: Prisma.UserUpsertArgs) {
    return this.prisma.user.upsert(args);
  }

  findMany(args?: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany(args);
  }
}
