import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Alchemy,
  GetNftsForOwnerOptions,
  Network,
  OwnedNft,
  TokenBalanceType,
  TokenBalancesOptionsErc20,
} from 'alchemy-sdk';
import { CacheService } from '../cache/cache.service';
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

  private secondsToCacheEns = 60;

  private getEnsCacheKey(address: string) {
    return `ens-address:${address.toLowerCase()}`;
  }

  constructor(
    private readonly config: ConfigService<Config>,
    private readonly cache: CacheService,
  ) {
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

  getOwnersForConract(contractAddress: string) {
    return this.alchemy.nft.getOwnersForContract(contractAddress);
  }

  getOwnersForNFT(contractAddress: string, tokenId: string) {
    return this.alchemy.nft.getOwnersForNft(contractAddress, tokenId);
  }

  async getNftsForOwner(address: string, options?: GetNftsForOwnerOptions) {
    const res = await this.paginate(
      (params) =>
        this.alchemy.nft.getNftsForOwner(address, { ...options, ...params }),
      'ownedNfts',
    );
    return res;
  }

  async getTokenBalances(address: string, options?: TokenBalancesOptionsErc20) {
    const res = await this.paginate(
      (params) =>
        this.alchemy.core.getTokenBalances(address, {
          ...options,
          ...params,
          type: TokenBalanceType.ERC20,
        }),
      'tokenBalances',
    );
    return res;
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

  resolveEnsName(name: string) {
    return this.alchemy.core.resolveName(name);
  }

  resolveCachedEnsName(name: string) {
    return this.cache.get(this.getEnsCacheKey(name));
  }

  async refreshResolveCachedEnsName(name: string) {
    const address = await this.resolveEnsName(name);
    return this.cache.set(
      this.getEnsCacheKey(name),
      address,
      this.secondsToCacheEns,
    );
  }

  async paginate<T>(
    getData: (params?: { pageKey?: string }) => Promise<
      {
        pageKey?: string;
      } & T
    >,
    dataKey: keyof T,
  ): Promise<Array<T[keyof T]>> {
    const res = await getData();
    let pageKey = res.pageKey;
    const data = res[dataKey] as Array<(typeof res)[keyof T]>;
    while (pageKey) {
      const { [dataKey]: newData, pageKey: newPageKey } = await getData({
        pageKey,
      });
      //@next -- need type safety here for getData(), res[dataKey] MUST be an array
      //@ts-ignore
      data.push(...newData);
      pageKey = newPageKey;
    }
    return data;
  }
}
