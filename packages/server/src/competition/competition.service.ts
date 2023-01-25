import { Injectable } from '@nestjs/common';
import { Competition, Prisma, User } from '@prisma/client';
import { TokenMetadataResponse } from 'alchemy-sdk';
import { MediaService } from 'src/media/media.service';
import { CurrencyService } from '../currency/currency.service';
import { CompetitionDto, RewardsDto } from '../dto/competition.dto';
import { CompetitionWithDefaultInclude } from '../interface';
import { AlchemyService } from './../alchemy/alchemy.service';
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
    private readonly media: MediaService,
    private readonly alchemy: AlchemyService,
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
      // grab the first submission for the cover image for the competiiton
      submissions: {
        include: { meme: { include: { media: true } } },
        orderBy: { createdAt: 'asc' },
        take: 1,
      },
    };
  }

  private addExtra(competition: CompetitionWithDefaultInclude) {
    const media = competition?.submissions[0]?.meme?.media;
    return {
      ...competition,
      curators: competition?.curators.map((item) => item.user),
      media: media ? this.media.addExtra(media) : undefined,
      submissions: undefined,
    };
  }

  addExtras(competitions: Array<CompetitionWithDefaultInclude>) {
    return competitions.map((item) => this.addExtra(item));
  }

  count(args?: Prisma.CompetitionCountArgs) {
    return this.prisma.competition.count(args);
  }

  async create({
    curators,
    creator,
    rewards,
    ...competition
  }: CompetitionDto & { creator: User }) {
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

    try {
      const comp = await this.prisma.competition.create({
        data: { ...competition, createdById: creator.id },
        include: this.defaultInclude,
      });
      await this.competitionCurator.upsert(
        comp.id,
        Array.from(new Set([...curators, creator.address])),
      );
      await this.upsertRewards(comp, rewards);
      return this.findFirst({ where: { id: comp.id } });
    } catch (e) {
      // since we rely on external apis in upsertRewards -- we delete the comp if it doesnt work here???
      throw new Error('blah');
    }
  }

  private async upsertRewards(competition: Competition, rewards: RewardsDto[]) {
    for (const reward of rewards) {
      const { contractAddress, type } = reward.currency;
      let currency = await this.currency.findFirst({
        where: {
          contractAddress,
          type,
        },
      });
      if (!currency) {
        const metadata =
          type === 'ERC20'
            ? await this.alchemy.getERC20Metadata(contractAddress)
            : await this.alchemy.getNftContractMetadata(contractAddress);
        const decimals =
          type === 'ERC20' ? (metadata as TokenMetadataResponse).decimals : 1;
        currency = await this.currency.create({
          data: {
            type: reward.currency.type,
            contractAddress: reward.currency.contractAddress,
            symbol: metadata.symbol,
            name: metadata.name,
            decimals,
          },
        });
      }
      await this.reward.create({
        data: {
          competitionId: competition.id,
          currencyId: currency.id,
          competitionRank: reward.competitionRank,
          currencyTokenId: reward.currency.tokenId,
          currencyAmount: reward.currency.amount,
        },
      });
    }
  }

  async findMany(args?: Prisma.CompetitionFindManyArgs) {
    return this.addExtras(
      (await this.prisma.competition.findMany({
        ...args,
        include: this.defaultInclude,
      })) as CompetitionWithDefaultInclude[],
    );
  }

  async findFirst(args?: Prisma.CompetitionFindFirstArgs) {
    return this.addExtra(
      (await this.prisma.competition.findFirst({
        ...args,
        include: this.defaultInclude,
      })) as CompetitionWithDefaultInclude,
    );
  }

  async findFirstOrFail(args?: Prisma.CompetitionFindFirstArgs) {
    const data = await this.prisma.competition.findFirst({
      ...args,
      include: this.defaultInclude,
    });
    if (!data) {
      throw new Error('Competition not found');
    }
    return this.addExtra(data as CompetitionWithDefaultInclude);
  }

  async getIsCompetitionActive(id: number) {
    const competition = await this.prisma.competition.findFirst({
      where: { id, endsAt: { gte: new Date() } },
    });
    return !!competition;
  }
}
