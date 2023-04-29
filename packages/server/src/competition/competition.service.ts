import { Injectable } from '@nestjs/common';
import { Competition, Prisma, User } from '@prisma/client';
import { TokenMetadataResponse } from 'alchemy-sdk';
import { BigNumber } from 'ethers';
import { MediaService } from 'src/media/media.service';
import { CurrencyService } from '../currency/currency.service';
import { CompetitionDto, RewardsDto } from '../dto/competition.dto';
import { CompetitionWithDefaultInclude } from '../interface';
import { AlchemyService } from './../alchemy/alchemy.service';
import { CompetitionCuratorService } from './../competition-curator/competition-curator.service';
import { PrismaService } from './../prisma.service';
import { RewardService } from './../reward/reward.service';
import { UserService } from './../user/user.service';

export class RewardsNotValidError extends Error {
  constructor(message: string) {
    super(message);
  }
}

@Injectable()
export class CompetitionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currency: CurrencyService,
    private readonly reward: RewardService,
    private readonly competitionCurator: CompetitionCuratorService,
    private readonly media: MediaService,
    private readonly alchemy: AlchemyService,
    private readonly user: UserService,
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
      votingRule: true,
      coverMedia: true,
    };
  }

  private async addExtra(competition: CompetitionWithDefaultInclude | null) {
    if (competition === null) {
      return null;
    }
    return {
      ...competition,
      curators: competition?.curators.map((item) => item.user),
      user: await this.user.addExtra(competition.user),
      isActive: new Date(competition.endsAt) > new Date(),
      coverMedia: this.media.addExtra(competition.coverMedia),
    };
  }

  async addExtras(competitions: Array<CompetitionWithDefaultInclude>) {
    const comps = [];
    for (const comp of competitions) {
      comps.push(await this.addExtra(comp));
    }
    return comps;
  }

  count(args?: Prisma.CompetitionCountArgs) {
    return this.prisma.competition.count(args);
  }

  async create({
    curators,
    creator,
    rewards,
    voters,
    ...competition
  }: CompetitionDto & { creator: User }) {
    const isRewardsValid = await this.reward.getIsAddressCustodyingRewards(
      creator.address,
      rewards,
    );
    if (!isRewardsValid) {
      throw new RewardsNotValidError('You are not custodying the rewards');
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
      console.error(e);
      console.log('BIG ERROR');
      // since we rely on external apis in upsertRewards -- we delete the comp if it doesnt work here???
      throw new Error('TODO HOW SHOULD WE HANDLE HERE');
    }
  }

  async updateCoverImage(file: Express.Multer.File, id: number, creator: User) {
    const media = await this.media.create(file, creator.id);
    return this.prisma.competition.update({
      where: { id },
      data: { coverMediaId: media.id },
    });
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
            ? await this.alchemy.getTokenMetadata(contractAddress)
            : await this.alchemy.getNftContractMetadata(contractAddress);
        const decimals =
          type === 'ERC20' ? (metadata as TokenMetadataResponse).decimals : 0;
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
      // next -- need support for decimals here
      const currencyAmountAtoms =
        type === 'ERC20'
          ? BigNumber.from(reward.currency.amount)
              .mul(BigNumber.from(10).pow(currency.decimals))
              .toString()
          : reward.currency.amount;
      await this.reward.create({
        data: {
          competitionId: competition.id,
          currencyId: currency.id,
          competitionRank: reward.competitionRank,
          currencyTokenId: reward.currency.tokenId,
          currencyAmountAtoms,
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
      where: { id, endsAt: { gt: new Date() } },
    });
    return !!competition;
  }

  async getIsCompetitionCreatedByUser(id: number, createdById: number) {
    const competition = await this.findFirst({
      where: {
        id,
        createdById,
      },
    });
    return !!competition;
  }

  async getCurators(competitionId: number) {
    const competitionCurator = await this.prisma.compeitionCurator.findMany({
      where: { competitionId },
      include: { user: true },
    });
    return competitionCurator.map((curator) => curator.user);
  }

  async hideMemeSubmission(competitionId: number, memeId: number) {
    return this.prisma.submission.update({
      where: { memeId_competitionId: { memeId, competitionId } },
      data: { deletedAt: new Date() },
    });
  }
}
