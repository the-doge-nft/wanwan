import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Alchemy, Network } from 'alchemy-sdk';
import { Config } from '../config/config';

@Injectable()
export class AlchemyService {
  private alchemy: Alchemy;
  private pixelContractAddress = '';

  constructor(private readonly config: ConfigService<Config>) {
    this.alchemy = new Alchemy({
      apiKey: this.config.get('alchemyApiKey'),
      network: Network.ETH_MAINNET,
    });
  }

  async getIsPixelHolder(address: string) {
    const { owners } = await this.alchemy.nft.getOwnersForContract(
      this.pixelContractAddress,
    );
    return owners.includes(address);
  }
}
