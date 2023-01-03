import { Injectable, Logger } from '@nestjs/common';
import { TokenType } from '@prisma/client';
import { ethers } from 'ethers';
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

  upsert(args: any) {
    return this.prisma.reward.upsert(args);
  }

  async getIsAddressCustodyingRewards(address: string, rewards: RewardsDto[]) {
    const promises = [];
    for (const reward of rewards) {
      const { type } = reward.currency;
      if (type == TokenType.ERC20) {
        promises.push(this.getIsERC20RewardValid(address, reward));
      } else if (type === TokenType.ERC721) {
        promises.push(this.getIsERC721RewardValid(address, reward));
      } else if (type === TokenType.ERC1155) {
        promises.push(this.getIsERC1155RewardValid(address, reward));
      } else {
        throw new Error('Token type invalid');
      }
    }
    return (await Promise.all(promises)).every((isValid) => !!isValid);
  }

  private async getIsERC20RewardValid(address: string, reward: RewardsDto) {
    const { contractAddress, amount } = reward.currency;
    const balances = await this.alchemy.getERC20Balances(address, [
      contractAddress,
    ]);
    const balance = balances[0]?.tokenBalance;
    return ethers.BigNumber.from(balance).gte(amount);
  }

  private async getIsERC721RewardValid(address: string, reward: RewardsDto) {
    const { contractAddress } = reward.currency;
    //@next should we use the same method as erc1155 for erc721 for simplicity?
    //@next we need to validate the token id here as well
    return this.alchemy.verifyNftOwnership(address, contractAddress);
  }

  private async getIsERC1155RewardValid(address: string, reward: RewardsDto) {
    const { contractAddress } = reward.currency;
    //@next we must validate the user is holding the NFT and also has the correct *amount*
    const { ownedNfts } = await this.alchemy.getOwnerNftsForContract(
      address,
      contractAddress,
    );
    // const tokenBalance = ownedNfts.filter(
    //   (item) => item.id.tokenId === tokenId,
    // );
    // this.logger.log('erc1155 balance', balance);

    // if (balance.length === 0) {
    //   return false;
    // }
    // return ethers.BigNumber.from(balance[0].balance).gte(amount);
  }
}
