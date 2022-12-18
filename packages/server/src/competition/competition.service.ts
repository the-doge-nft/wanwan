import { Injectable } from '@nestjs/common';
import { Competition, Prisma, User } from '@prisma/client';
import { formatEthereumAddress } from './../helpers/strings';
import { PrismaService } from './../prisma.service';
import { UserService } from './../user/user.service';

@Injectable()
export class CompetitionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UserService,
  ) {}

  private afterGetCompetition(
    competition: Array<Prisma.CompetitionGetPayload<Prisma.CompetitionArgs>>,
  ) {
    return competition.map((comp) => {
      const data: { curators?: { user: User }[] } & Competition = {
        ...comp,
      };
      const userCurators = [];
      data?.curators.forEach((item) => userCurators.push(item.user));
      data.curators = userCurators;
      return data;
    });
  }

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
      await this.prisma.compeitionCurator.create({
        data: { competitionId: comp.id, userId: user.id },
      });
    }
    return comp;
  }

  async findMany(args: Prisma.CompetitionFindManyArgs) {
    return this.afterGetCompetition(
      await this.prisma.competition.findMany(args),
    );
  }
}
