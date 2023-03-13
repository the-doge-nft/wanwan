import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserWithEns } from '../interface';
import { EthersService } from './../ethers/ethers.service';
import { PrismaService } from './../prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ethers: EthersService,
  ) {}

  async addExtra(user: User): Promise<UserWithEns> {
    const ens = await this.ethers.getCachedEnsName(user.address);
    return { ...user, ens };
  }

  async addExtras(users: User[]): Promise<UserWithEns[]> {
    const ret = [];
    for (const user of users) {
      users.push(await this.addExtra(user));
    }
    return ret;
  }

  count(args?: Prisma.UserCountArgs) {
    return this.prisma.user.count(args);
  }

  upsert(args?: Prisma.UserUpsertArgs) {
    return this.prisma.user.upsert(args);
  }

  async findMany(args?: Prisma.UserFindManyArgs) {
    return this.addExtras(await this.prisma.user.findMany(args));
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
}
