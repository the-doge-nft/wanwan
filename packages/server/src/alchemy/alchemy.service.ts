import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Alchemy, GetNftsForOwnerOptions, Network } from 'alchemy-sdk';
import { Config } from '../config/config';
import { AppEnv } from './../config/config';

@Injectable()
export class AlchemyService {
  private alchemy: Alchemy;
  private pixelContractAddress = '';

  constructor(private readonly config: ConfigService<Config>) {
    const network =
      this.config.get('appEnv') === AppEnv.production
        ? Network.ETH_MAINNET
        : Network.ETH_GOERLI;
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

  getERC20Balances(address: string, contractAddresses: string[]) {
    return this.alchemy.core.getTokenBalances(address, contractAddresses);
  }

  getOwnersForNFT(contractAddress: string, tokenId: string) {
    return this.alchemy.nft.getOwnersForNft(contractAddress, tokenId);
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

  getEnsFromAddress(address: string) {}
}
