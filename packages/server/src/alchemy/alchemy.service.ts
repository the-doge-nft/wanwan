import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenType } from '@prisma/client';
import {
  Alchemy,
  GetNftsForOwnerOptions,
  Network,
  NftTokenType,
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

  verifyNftOwnership(address: string, contractAddress: string) {
    return this.alchemy.nft.verifyNftOwnership(address, contractAddress);
  }

  async getBalanceOfNFT(
    ownerAddress: string,
    contractAddress: string,
    tokenId: string,
  ) {
    let nfts: OwnedNft[] = [];
    let pageKey: string | undefined | null = null;
    const pageSize = 100;

    const balance = await this.alchemy.nft.getNftsForOwner(ownerAddress, {
      contractAddresses: [contractAddress],
      pageSize,
    });
    pageKey = balance.pageKey;
    nfts = nfts.concat(balance.ownedNfts);

    // to optimize -- check if balance is in here before concating
    while (pageKey) {
      const nextBalance = await this.alchemy.nft.getNftsForOwner(ownerAddress, {
        contractAddresses: [contractAddress],
        pageKey,
        pageSize,
      });
      nfts = [...nfts, ...nextBalance.ownedNfts];
      pageKey = nextBalance.pageKey;
    }
    const tokenIdBalance = nfts.filter((item) => {
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

  getNftsForContract(contractAddress: string) {
    return this.alchemy.nft.getNftsForContract(contractAddress, {
      pageSize: 10,
    });
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
    for (const balance of res) {
      //@ts-ignore
      const metadata = await this.getTokenMetadata(balance.contractAddress);
      //@ts-ignore
      balance.metadata = metadata;
    }
    return res;
  }

  getEthBalance(address: string) {
    return this.alchemy.core.getBalance(address);
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

  // NOTE: this will NOT throw for ERC721 & ERC115 tokens
  getTokenMetadata(address: string) {
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

  async getTokenType(contractAddress: string): Promise<TokenType> {
    try {
      const nft = await this.getNftContractMetadata(contractAddress);
      if (
        ![NftTokenType.ERC1155, NftTokenType.ERC721].includes(nft.tokenType)
      ) {
        throw new Error('Not an NFT we recognize');
      }

      return nft.tokenType === NftTokenType.ERC1155
        ? TokenType.ERC1155
        : TokenType.ERC721;
    } catch (e) {
      console.error('error getting metadata', e);
      try {
        await this.getTokenMetadata(contractAddress);
        return TokenType.ERC20;
      } catch (e) {
        console.error('error getting nft', e);
        throw new Error('Not valid ERC20, ERC1155, or ERC721');
      }
    }
  }

  async refreshResolveCachedEnsName(name: string) {
    const address = await this.resolveEnsName(name);
    return this.cache.set(
      this.getEnsCacheKey(name),
      address,
      this.secondsToCacheEns,
    );
  }

  async getTxReceipt(txId: string) {
    return this.alchemy.core.getTransactionReceipt(txId);
  }

  async getTx(txId: string) {
    return this.alchemy.core.getTransaction(txId);
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
