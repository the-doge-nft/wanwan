import { Injectable } from '@nestjs/common';
import { Competition, Currency, Prisma, TokenType, User } from '@prisma/client';
import { BigNumber, TokenMetadataResponse } from 'alchemy-sdk';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { CompetitionVotingRuleService } from '../competition-voting-rule/competition-voting-rule.service';
import { CurrencyService } from '../currency/currency.service';
import { CompetitionDto, RewardsDto } from '../dto/competition.dto';
import { CompetitionWithDefaultInclude } from '../interface';
import { MediaService } from '../media/media.service';
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
    private readonly votingRule: CompetitionVotingRuleService,
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
      votingRule: {
        include: {
          currency: true,
        },
      },
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

      for (const voter of voters) {
        const currency = await this.getCurrencyOrCreate(
          voter.contractAddress,
          voter.type,
        );

        await this.votingRule.create({
          data: {
            competitionId: comp.id,
            currencyId: currency.id,
          },
        });
      }

      await this.competitionCurator.upsert(
        comp.id,
        Array.from(new Set([...curators, creator.address])),
      );
      await this.upsertRewards(comp, rewards);
      return this.findFirst({ where: { id: comp.id } });
    } catch (e) {
      console.error(e);
      // since we rely on external apis in upsertRewards -- we delete the comp if it doesnt work here???
      throw new Error('TODO HOW SHOULD WE HANDLE HERE');
    }
  }

  async updateCoverImage(file: Express.Multer.File, id: number, creator: User) {
    const media = await this.media.create(file, creator.id);
    const comp = await this.prisma.competition.update({
      where: { id },
      data: { coverMediaId: media.id },
    });
    return this.findFirst({ where: { id: comp.id } });
  }

  private async upsertRewards(competition: Competition, rewards: RewardsDto[]) {
    for (const reward of rewards) {
      const currency = await this.getCurrencyOrCreate(
        reward.currency.contractAddress,
        reward.currency.type,
      );
      // We only support single NFT transfers for now
      let currencyAmountAtoms = '1';
      if (reward.currency.type === TokenType.ETH) {
        currencyAmountAtoms = parseEther(reward.currency.amount).toString();
      } else {
        currencyAmountAtoms = parseUnits(
          reward.currency.amount,
          currency.decimals,
        ).toString();
      }

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

  private async getCurrencyOrCreate(
    contractAddress: string | null,
    type: TokenType,
  ) {
    let currency = await this.currency.findFirst({
      where: { contractAddress, type },
    });
    if (currency) {
      return currency;
    }

    if (type !== TokenType.ETH) {
      const metadata = await this.alchemy.getTokenMetadata(contractAddress);
      // NFTs don't have decimal amounts
      let decimals = 0;
      if (type === TokenType.ERC20) {
        decimals = (metadata as TokenMetadataResponse).decimals;
      }

      currency = await this.currency.create({
        data: {
          type,
          contractAddress,
          symbol: metadata.symbol,
          name: metadata.name,
          decimals,
        },
      });
    } else if (type === TokenType.ETH) {
      currency = await this.currency.create({
        data: {
          type,
          contractAddress: null,
          symbol: 'ETH',
          name: 'Ethereum',
          decimals: 18,
        },
      });
    }
    return currency;
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

  async getCanUserVote(userAddress: string, competitionId: number) {
    return (await this.getVoteReason(userAddress, competitionId)).some(
      (item) => item.canVote,
    );
  }

  async getVoteReason(userAddress: string, competitionId: number) {
    const votingRules = await this.votingRule.findMany({
      where: {
        competitionId,
      },
    });

    const canVote: Array<{ canVote: boolean; currency: Currency }> = [];

    for (const rule of votingRules) {
      const { currency } = rule;

      if (
        currency.type === TokenType.ERC721 ||
        currency.type === TokenType.ERC1155
      ) {
        const isValid = await this.alchemy.verifyNftOwnership(
          userAddress,
          currency.contractAddress,
        );
        canVote.push({ currency, canVote: isValid });
      } else if (currency.type === TokenType.ERC20) {
        const balances = await this.alchemy.getERC20Balances(userAddress, [
          currency.contractAddress,
        ]);
        const balance = balances.tokenBalances?.[0];
        canVote.push({
          currency,
          canVote: BigNumber.from(balance?.tokenBalance).gt(0),
        });
      } else if (currency.type === TokenType.ETH) {
        const balance = await this.alchemy.getEthBalance(userAddress);
        canVote.push({ currency, canVote: BigNumber.from(balance).gt(0) });
      }
    }
    return canVote;
  }
}
