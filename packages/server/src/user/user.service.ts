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

  async getWanScore(address: string) {
    const memeFactor = 1;
    const voteFactor = 2;
    const submissionFactor = 4;
    const [memes, votes, submissions] = await Promise.all([
      this.prisma.meme.count({
        where: { user: { address } },
      }),
      this.prisma.vote.count({
        where: { user: { address } },
      }),
      this.prisma.submission.count({
        where: { user: { address } },
      }),
    ]);
    const wan =
      memes / memeFactor + votes / voteFactor + submissions / submissionFactor;
    return wan;
  }
}
