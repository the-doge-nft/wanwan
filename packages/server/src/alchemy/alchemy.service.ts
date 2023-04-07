import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Alchemy,
  GetNftsForOwnerOptions,
  Network,
  OwnedNft,
} from 'alchemy-sdk';
import { Config } from '../config/config';
import { AppEnv } from './../config/config';

@Injectable()
export class AlchemyService {
  private readonly logger = new Logger(AlchemyService.name);
  private alchemy: Alchemy;
  private pixelContractAddress: string;

  private GOERLI_PIXEL_CONTRACT_ADDRESS =
    '0x0eAADb89776e98B5D9a278f4a11f4b3f20226276';
  private MAINNET_PIXEL_CONTRACT_ADDRESS =
    '0x07887Ee0Bd24E774903963d50cF4Ec6a0a16977D';

  constructor(private readonly config: ConfigService<Config>) {
    const network =
      this.config.get('appEnv') === AppEnv.production
        ? Network.ETH_MAINNET
        : Network.ETH_GOERLI;
    this.pixelContractAddress =
      this.config.get('appEnv') === AppEnv.production
        ? this.MAINNET_PIXEL_CONTRACT_ADDRESS
        : this.GOERLI_PIXEL_CONTRACT_ADDRESS;
    this.alchemy = new Alchemy({
      apiKey: this.config.get('alchemy').apiKey,
      network,
    });
  }

  async getIsPixelHolder(address: string) {
    return this.verifyNftOwnership(address, this.pixelContractAddress);
  }

  private verifyNftOwnership(address: string, contractAddress: string) {
    return this.alchemy.nft.verifyNftOwnership(address, contractAddress);
  }

  async getBalanceOfNFT(
    ownerAddress: string,
    contractAddress: string,
    tokenId: string,
  ) {
    let nfts: OwnedNft[] = [];
    let pageKey: string | undefined | null = null;
    const pageSize = 1;

    const balance = await this.alchemy.nft.getNftsForOwner(ownerAddress, {
      contractAddresses: [contractAddress],
      pageSize,
    });
    this.logger.log('got inital nfts', balance.ownedNfts.length);
    pageKey = balance.pageKey;
    nfts = nfts.concat(balance.ownedNfts);

    // to optimize -- check if balance is in here before concating
    while (pageKey) {
      this.logger.log('querying for next page nfts');
      const nextBalance = await this.alchemy.nft.getNftsForOwner(ownerAddress, {
        contractAddresses: [contractAddress],
        pageKey,
        pageSize,
      });
      nfts = [...nfts, ...nextBalance.ownedNfts];
      this.logger.log('got nfts', nfts.length);
      pageKey = nextBalance.pageKey;
    }
    console.log(nfts.map((item) => item.tokenId));
    const tokenIdBalance = nfts.filter((item) => {
      console.log(item.tokenId, tokenId);
      return item.tokenId === tokenId;
    })?.[0]?.balance;
    return tokenIdBalance || 0;
  }

  getERC20Balances(address: string, contractAddresses: string[]) {
    return this.alchemy.core.getTokenBalances(address, contractAddresses);
  }

  getOwnersForNFT(contractAddress: string, tokenId: string) {
    return this.alchemy.nft.getOwnersForNft(contractAddress, tokenId);
  }

  getIsSpamContract(address: string) {
    return this.alchemy.nft.isSpamContract(address);
  }

  getOwnerNftsForContract(
    address: string,
    contractAddresses: string[] | string,
    options?: GetNftsForOwnerOptions,
  ) {
    return this.alchemy.nft.getNftsForOwner(address, {
      contractAddresses: Array.isArray(contractAddresses)
        ? contractAddresses
        : [contractAddresses],
      ...options,
    });
  }

  getERC20Metadata(address: string) {
    return this.alchemy.core.getTokenMetadata(address);
  }

  getNftContractMetadata(address: string) {
    return this.alchemy.nft.getContractMetadata(address);
  }

  // getEnsFromAddress(address: string) {}
}
