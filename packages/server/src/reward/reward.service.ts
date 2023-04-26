import { Injectable, Logger } from '@nestjs/common';
import { Prisma, TokenType } from '@prisma/client';
import { BigNumber } from 'ethers';
import { AlchemyService } from '../alchemy/alchemy.service';
import { RewardsDto } from '../dto/competition.dto';
import { PrismaService } from './../prisma.service';

@Injectable()
export class RewardService {
  private readonly logger = new Logger(RewardService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly alchemy: AlchemyService,
  ) {}

  async getIsAddressCustodyingRewards(address: string, rewards: RewardsDto[]) {
    const promises = [];
    for (const reward of rewards) {
      const { type } = reward.currency;
      if (type == TokenType.ERC20) {
        promises.push(this.getIsERC20RewardValid(address, reward));
      } else if (type === TokenType.ERC1155 || type === TokenType.ERC721) {
        promises.push(this.getIsNftRewardValid(address, reward));
      } else {
        throw new Error('Token type invalid');
      }
    }
    return (await Promise.all(promises)).every((isValid) => !!isValid);
  }

  // next -- need support for decimals here
  private async getIsERC20RewardValid(
    address: string,
    reward: RewardsDto,
  ): Promise<boolean> {
    const { contractAddress, amount } = reward.currency;
    const balances = await this.alchemy.getERC20Balances(address, [
      contractAddress,
    ]);
    const metadata = await this.alchemy.getTokenMetadata(contractAddress);
    const balance = balances.tokenBalances[0].tokenBalance;
    const amountAtoms = BigNumber.from(amount).mul(
      BigNumber.from(10).pow(metadata.decimals),
    );
    this.logger.log(
      `querying erc20 reward balance -- [user::${address} contract::${contractAddress} amount::${amount} decimals::${metadata.decimals}]    balance::${balance} >= atoms::${amountAtoms}`,
    );
    return BigNumber.from(balance).gte(amountAtoms);
  }

  private async getIsNftRewardValid(address: string, reward: RewardsDto) {
    const { contractAddress, tokenId } = reward.currency;
    const balance = await this.alchemy.getBalanceOfNFT(
      address,
      contractAddress,
      tokenId,
    );
    this.logger.log(
      `querying nft reward balance -- [user::${address} contract::${contractAddress} tokenId::${tokenId}]    balance::${balance} >= amount::${reward.currency.amount}`,
    );
    return balance >= parseInt(reward.currency.amount);
  }

  upsert(args: Prisma.RewardUpsertArgs) {
    return this.prisma.reward.upsert(args);
  }
  create(args: Prisma.RewardCreateArgs) {
    return this.prisma.reward.create(args);
  }
  update(args: Prisma.RewardUpdateArgs) {
    return this.prisma.reward.update(args);
  }
  findFirst(args: Prisma.RewardFindFirstArgs) {
    return this.prisma.reward.findFirst(args);
  }
}
