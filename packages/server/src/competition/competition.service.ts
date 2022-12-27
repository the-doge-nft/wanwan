import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { CurrencyService } from '../currency/currency.service';
import { CompetitionDto, RewardsDto } from '../dto/competition.dto';
import { CompetitionWithCuratorUsers } from '../interface';
import { AlchemyService } from './../alchemy/alchemy.service';
import { formatEthereumAddress } from './../helpers/strings';
import { PrismaService } from './../prisma.service';
import { RewardService } from './../reward/reward.service';
import { UserService } from './../user/user.service';

@Injectable()
export class CompetitionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UserService,
    private readonly currency: CurrencyService,
    private readonly alchemy: AlchemyService,
    private readonly reward: RewardService,
  ) {}

  private get defaultInclude(): Prisma.CompetitionInclude {
    return {
      curators: {
        include: {
          user: true,
        },
      },
      rewards: {
        include: {
          currency: true,
        },
      },
    };
  }

  private formatCurators(curators: string[]) {
    return Array.from(
      new Set(curators.map((address) => formatEthereumAddress(address))),
    );
  }

  private async upsertCurators(competitionId: number, curators: string[]) {
    for (const address of curators) {
      const user = await this.user.upsert({
        where: { address },
        create: { address, lastAuthedAt: new Date() },
        update: {},
      });
      await this.prisma.compeitionCurator.create({
        data: { competitionId, userId: user.id },
      });
    }
  }

  private async upsertRewards(rewards: RewardsDto[]) {
    for (const reward of rewards) {
      const currency = await this.currency.findFirst({
        where: { contractAddress: reward.currency.contractAddress },
      });
      if (!currency) {
        /* @next
          - check if currency is 721, 1155, or 20
          - create with units + symbol
        */
      }
    }
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

  async create({
    curators,
    creator,
    rewards,
    ...competition
  }: CompetitionDto & { creator: User }) {
    const comp = await this.prisma.competition.create({
      data: { ...competition, createdById: creator.id },
      include: this.defaultInclude,
    });
    await this.upsertCurators(
      comp.id,
      this.formatCurators([...curators, creator.address]),
    );
    await this.upsertRewards(rewards);
    return this.findFirst({ where: { id: comp.id } });
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
