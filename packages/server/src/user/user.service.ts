import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserWithExtras } from '../interface';
import { PrismaService } from './../prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async addExtra(user: User): Promise<UserWithExtras> {
    if (user === null) {
      return null;
    }
    return user;
  }

  async addExtras(users: User[]): Promise<UserWithExtras[]> {
    const usersWithExtras = [];
    for (const user of users) {
      usersWithExtras.push(await this.addExtra(user));
    }
    return usersWithExtras;
  }

  count(args?: Prisma.UserCountArgs) {
    return this.prisma.user.count(args);
  }

  upsert(args?: Prisma.UserUpsertArgs) {
    return this.prisma.user.upsert(args);
  }

  async findMany(args?: Prisma.UserFindManyArgs) {
    const many = await this.prisma.user.findMany(args);
    return this.addExtras(many);
  }

  async findFirst(args?: Prisma.UserFindFirstArgs) {
    return this.addExtra(await this.prisma.user.findFirst(args));
  }

  update(args?: Prisma.UserUpdateArgs) {
    return this.prisma.user.update(args);
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

  async getLeaderboard() {
    const users = await this.findMany();
    const usersWithWan = [];
    for (const user of users) {
      const wan = await this.getWanScore(user.address);
      usersWithWan.push({ wan, ...user });
    }
    usersWithWan.sort((a, b) => b.wan - a.wan);
    return usersWithWan;
  }
}
