import { Injectable } from '@nestjs/common';
import { Competition, Prisma, User } from '@prisma/client';
import { CurrencyService } from '../currency/currency.service';
import { CompetitionDto, RewardsDto } from '../dto/competition.dto';
import { CompetitionWithCuratorUsers } from '../interface';
import { CompetitionCuratorService } from './../competition-curator/competition-curator.service';
import { PrismaService } from './../prisma.service';
import { RewardService } from './../reward/reward.service';

@Injectable()
export class CompetitionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currency: CurrencyService,
    private readonly reward: RewardService,
    private readonly competitionCurator: CompetitionCuratorService,
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
      user: true,
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

  count(args?: Prisma.CompetitionCountArgs) {
    return this.prisma.competition.count(args);
  }

  private async upsertRewards(competition: Competition, rewards: RewardsDto[]) {
    for (const reward of rewards) {
      const { contractAddress, type } = reward.currency;
      const currency = await this.currency.findFirst({
        where: {
          contractAddress,
          type,
        },
      });
      if (!currency) {
        /* @next
          - check if currency is 721, 1155, or 20
          - create with units + symbol
        */
      }
      await this.reward.upsert({ where: { competitionId: competition.id } });
    }
  }

  async create({
    curators,
    creator,
    rewards,
    ...competition
  }: CompetitionDto & { creator: User }) {
    // check if creator is custodying the rewards
    if (
      !(await this.reward.getIsAddressCustodyingRewards(
        creator.address,
        rewards,
      ))
    ) {
      throw new Error(
        'You must be holding the rewards to create a competition',
      );
    }

    // create our competition
    const comp = await this.prisma.competition.create({
      data: { ...competition, createdById: creator.id },
      include: this.defaultInclude,
    });

    // upsert curators
    await this.competitionCurator.upsert(
      comp.id,
      Array.from(new Set([...curators, creator.address])),
    );

    // upsert rewards
    await this.upsertRewards(comp, rewards);
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
