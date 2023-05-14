import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { Prisma, TokenType } from '@prisma/client';
import { BigNumber, ethers } from 'ethers';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import erc1155Abi from 'src/abis/erc1155';
import { AlchemyService } from '../alchemy/alchemy.service';
import { CompetitionService } from '../competition/competition.service';
import { RewardsDto } from '../dto/competition.dto';
import InvalidRewardTxError from '../error/InvalidRewardTx.error';
import { addressEqual } from '../helpers/strings';
import { MemeService } from '../meme/meme.service';
import { PrismaService } from './../prisma.service';

@Injectable()
export class RewardService {
  private readonly logger = new Logger(RewardService.name);

  private get defaultInclude() {
    return {
      currency: true,
    };
  }

  constructor(
    private readonly prisma: PrismaService,
    private readonly alchemy: AlchemyService,
    @Inject(forwardRef(() => CompetitionService))
    private readonly competition: CompetitionService,
    private readonly meme: MemeService,
  ) {}

  async getIsAddressCustodyingRewards(address: string, rewards: RewardsDto[]) {
    const promises = [];
    for (const reward of rewards) {
      const { type } = reward.currency;
      if (type == TokenType.ERC20) {
        promises.push(this.getIsERC20RewardValid(address, reward));
      } else if (type === TokenType.ERC1155 || type === TokenType.ERC721) {
        promises.push(this.getIsNftRewardValid(address, reward));
      } else if (type === TokenType.ETH) {
        promises.push(this.getIsETHRewardValid(address, reward));
      } else {
        throw new Error('Token type invalid');
      }
    }
    return (await Promise.all(promises)).every((isValid) => !!isValid);
  }

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
    const amountAtoms = parseUnits(amount, metadata.decimals);
    return BigNumber.from(balance).gte(amountAtoms);
  }

  private async getIsNftRewardValid(address: string, reward: RewardsDto) {
    const { contractAddress, tokenId } = reward.currency;
    const balance = await this.alchemy.getBalanceOfNFT(
      address,
      contractAddress,
      tokenId,
    );
    return balance >= parseInt(reward.currency.amount);
  }

  private async getIsETHRewardValid(address: string, reward: RewardsDto) {
    const ethBalance = await this.alchemy.getEthBalance(address);
    return ethBalance.gte(parseEther(reward.currency.amount));
  }

  async getIsRewardTxValid(rewardId: number, txId: string) {
    this.logger.log(`confirming reward`);
    const tx = await this.alchemy.getTxReceipt(txId);
    console.log('debug:: tx', tx);
    const logs = tx.logs;
    if (!tx) {
      throw new InvalidRewardTxError('Transaction has not been mined.');
    }
    const reward = await this.findFirst({
      where: { id: rewardId },
    });
    const competition = await this.competition.findFirst({
      where: {
        rewards: {
          some: { id: rewardId },
        },
      },
    });

    const rankedMemes = await this.meme.getRankedMemesByCompetitionId(
      competition.id,
    );

    const winningMeme = rankedMemes?.[reward.competitionRank - 1];
    if (!winningMeme) {
      throw new InvalidRewardTxError('No winning meme found for this reward');
    }

    if (!addressEqual(competition.user.address, tx.from)) {
      throw new InvalidRewardTxError(
        "Transaction sender doesn't match competition creator",
      );
    }

    if (reward.currency.type === TokenType.ETH) {
      if (!addressEqual(winningMeme.user.address, tx.to)) {
        throw new InvalidRewardTxError(
          "Transaction receiver doesn't match winning meme creator",
        );
      }
    } else {
      if (!addressEqual(reward.currency.contractAddress, tx.to)) {
        throw new InvalidRewardTxError(
          "Transaction receiver doesn't match reward contract address",
        );
      }
    }

    // console.log('reward', reward);
    // console.log('tx', tx);
    // console.log('logs', logs);

    /*  
      decode the logs based on the type of token transfer the reward is supposed to be
    
      1: ERC1155 Transfer(address,address,uint256)
      2: ERC721 Transfer(address,address,uint256)
      3: ERC20 Transfer(address,address,uint256)
      4: ETH

      1155 SEND
      https://goerli.etherscan.io/tx/0x0ab51ce3ee869584ae37c4337cbcdc7f8b7dac50d3ffea4240971c1f62682444
    
      ETH SEND
      https://goerli.etherscan.io/tx/0x3bf296e5b03a952776bef2e8d41ea204cece97effb9e0b73612a1e18f12ac005
    */

    if (reward.currency.type === TokenType.ERC1155) {
      const i = new ethers.utils.Interface(erc1155Abi);
      const decodedLogs = logs.map((log) => i.parseLog(log));
      const transferLog = decodedLogs.find(
        (log) => log.name === 'TransferSingle',
      );
      if (!transferLog) {
        throw new InvalidRewardTxError(
          'No TransferSingle log found in transaction',
        );
      }
      const { from, to, id, value } = transferLog.args;
      if (!addressEqual(from, tx.from)) {
        throw new InvalidRewardTxError(
          "Transaction sender doesn't match TransferSingle from address",
        );
      }
      if (!addressEqual(to, winningMeme.user.address)) {
        throw new InvalidRewardTxError(
          "Transaction receiver doesn't match winning meme creator",
        );
      }
      if (id.toString() !== reward.currencyTokenId) {
        throw new InvalidRewardTxError(
          'Transaction tokenId does not match reward tokenId',
        );
      }
      if (!value.eq(1)) {
        throw new InvalidRewardTxError('Transaction value should only be 1');
      }
    } else if (reward.currency.type === TokenType.ERC721) {
    } else if (reward.currency.type === TokenType.ERC20) {
    } else if (reward.currency.type === TokenType.ETH) {
      const tx = await this.alchemy.getTx(txId);
      const { value } = tx;
      if (!value.eq(reward.currencyAmountAtoms)) {
        throw new InvalidRewardTxError(
          'Transaction value does not match reward amount',
        );
      }
    } else {
      throw new InvalidRewardTxError('Invalid token type');
    }
    return true;
  }

  // private get tokenTypeToContract() {
  //   return {
  //     [CurrencyType.ERC1155]: {
  //       abi: erc1155Abi,
  //       method: 'safeTransferFrom',
  //     },
  //     [CurrencyType.ERC721]: {
  //       abi: erc721Abi,
  //       method: 'transferFrom',
  //     },
  //     [CurrencyType.ERC20]: {
  //       abi: erc20Abi,
  //       method: 'transfer',
  //     },
  //   };
  // }

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
    return this.prisma.reward.findFirst({
      include: { ...this.defaultInclude, ...args?.include },
      ...args,
    });
  }
}

class TestData {
  reward = {
    id: 5,
    txId: null,
    competitionId: 4,
    receivedById: null,
    currencyId: 1,
    competitionRank: 1,
    currencyTokenId: '1018155',
    currencyAmountAtoms: '1',
    createdAt: '2023-05-13T08:02:03.669Z',
    updatedAt: '2023-05-13T08:02:03.669Z',
    status: 'PENDING',
  };

  tx = {
    to: '0x0eAADb89776e98B5D9a278f4a11f4b3f20226276',
    from: '0x18F33CEf45817C428d98C4E188A770191fDD4B79',
    contractAddress: null,
    transactionIndex: 22,
    gasUsed: { type: 'BigNumber', hex: '0xbb21' },
    logsBloom:
      '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000001000040000000000000200000000000000008000000000008000000000000000000000000000000000000000000040000020000000000000000000800000000000000010000000010000000000000000000000100000000000000000000000000000000000000000000000000020400000000000000000008000000000000000000000000000000000000000000000002000000000000000000200000000000000000000000000000000020100010010000000000000000000000000000000000000000000000000000000000',
    blockHash:
      '0xb716025814c95ba3412eb169dde4d4504ee3337f470f625c704352e4615ea1b0',
    transactionHash:
      '0x0ab51ce3ee869584ae37c4337cbcdc7f8b7dac50d3ffea4240971c1f62682444',
    logs: [
      {
        transactionIndex: 22,
        blockNumber: 8992071,
        transactionHash:
          '0x0ab51ce3ee869584ae37c4337cbcdc7f8b7dac50d3ffea4240971c1f62682444',
        address: '0x0eAADb89776e98B5D9a278f4a11f4b3f20226276',
        topics: [
          '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
          '0x00000000000000000000000018f33cef45817c428d98c4e188a770191fdd4b79',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x00000000000000000000000000000000000000000000000000000000000f892b',
        ],
        data: '0x',
        logIndex: 42,
        blockHash:
          '0xb716025814c95ba3412eb169dde4d4504ee3337f470f625c704352e4615ea1b0',
      },
      {
        transactionIndex: 22,
        blockNumber: 8992071,
        transactionHash:
          '0x0ab51ce3ee869584ae37c4337cbcdc7f8b7dac50d3ffea4240971c1f62682444',
        address: '0x0eAADb89776e98B5D9a278f4a11f4b3f20226276',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x00000000000000000000000018f33cef45817c428d98c4e188a770191fdd4b79',
          '0x000000000000000000000000d801d86c10e2185a8fcbccfb7d7baf0a6c5b6bd5',
          '0x00000000000000000000000000000000000000000000000000000000000f892b',
        ],
        data: '0x',
        logIndex: 43,
        blockHash:
          '0xb716025814c95ba3412eb169dde4d4504ee3337f470f625c704352e4615ea1b0',
      },
    ],
    blockNumber: 8992071,
    confirmations: 1,
    cumulativeGasUsed: { type: 'BigNumber', hex: '0x4af11e' },
    effectiveGasPrice: { type: 'BigNumber', hex: '0x59682f0c' },
    status: 1,
    type: 2,
    byzantium: true,
  };
}
