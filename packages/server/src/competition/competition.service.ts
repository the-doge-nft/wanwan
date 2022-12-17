import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { formatEthereumAddress } from './../helpers/strings';
import { PrismaService } from './../prisma.service';
import { UserService } from './../user/user.service';

@Injectable()
export class CompetitionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UserService,
  ) {}

  async create({ curators, creator, ...competition }: any) {
    const comp = await this.prisma.competition.create({
      data: { ...competition, createdById: creator.id },
    });
    const formattedCurators: string[] = Array.from(
      new Set(curators.map((address) => formatEthereumAddress(address))),
    );

    // creators must also be curators
    const formattedCreatorAddress = formatEthereumAddress(creator.address);
    if (!formattedCurators.includes(formattedCreatorAddress)) {
      formattedCurators.push(formattedCreatorAddress);
    }

    for (const address of formattedCurators) {
      const user = await this.user.upsert({
        where: { address },
        create: { address, lastAuthedAt: new Date() },
        update: {},
      });
      console.log('user', user);
      await this.prisma.compeitionCurator.create({
        data: { competitionId: comp.id, userId: user.id },
      });
    }
  }

  findMany(args: Prisma.CompetitionFindManyArgs) {
    return this.prisma.competition.findMany(args);
  }
}
