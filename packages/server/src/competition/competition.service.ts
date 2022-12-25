import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CompetitionWithCuratorUsers } from '../interface';
import { formatEthereumAddress } from './../helpers/strings';
import { PrismaService } from './../prisma.service';
import { UserService } from './../user/user.service';

@Injectable()
export class CompetitionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UserService,
  ) {}

  private get defaultInclude(): Prisma.CompetitionInclude {
    return {
      curators: {
        include: {
          user: true,
        },
      },
    };
  }

  private addExtra(competition: CompetitionWithCuratorUsers) {
    return {
      ...competition,
      curators: competition?.curators.map((item) => item.user),
    };
  }

  private addExtras(competitions: Array<CompetitionWithCuratorUsers>) {
    return competitions.map((item) => this.addExtra(item));
  }

  async create({ curators, creator, ...competition }: any) {
    const comp = await this.prisma.competition.create({
      data: { ...competition, createdById: creator.id },
      include: this.defaultInclude,
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
    return this.addExtra(comp as CompetitionWithCuratorUsers);
  }

  async findMany(args?: Prisma.CompetitionFindManyArgs) {
    return this.addExtras(
      (await this.prisma.competition.findMany({
        ...args,
        include: this.defaultInclude,
      })) as CompetitionWithCuratorUsers[],
    );
  }

  async findFirst(args?: Prisma.CompetitionFindFirstArgs) {
    return this.addExtra(
      (await this.prisma.competition.findFirst({
        ...args,
        include: this.defaultInclude,
      })) as CompetitionWithCuratorUsers,
    );
  }
}
