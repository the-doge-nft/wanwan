import { OwnedNft } from "alchemy-sdk";
import { computed, makeObservable, observable } from "mobx";
import { objectKeys } from "../helpers/arrays";
import { Wallet } from "../interfaces";

export enum WalletView {}

export default class WalletStore {
  @observable
  selectedAddress: string | null | number = "all";

  @observable
  wallet: Wallet;

  constructor(wallet: Wallet) {
    makeObservable(this);
    this.wallet = wallet;
  }

  @computed
  get nftsByAddress() {
    const nfts: { [key: string]: Array<OwnedNft> } = {};
    this.wallet.nft.forEach((nft) => {
      if (!nfts[nft.contract.address]) {
        nfts[nft.contract.address] = [nft];
      } else {
        nfts[nft.contract.address].push(nft);
      }
    });
    return nfts;
  }

  @computed
  get selectedNfts() {
    if (this.selectedAddress == "all") {
      let nfts: Array<OwnedNft> = [];
      objectKeys(this.nftsByAddress).forEach((key) => {
        nfts = nfts.concat(this.nftsByAddress[key]);
      });
      return nfts;
    } else {
      return this.nftsByAddress[this.selectedAddress as string];
    }
  }

  @computed
  get selectedNftsCount() {
    return this.selectedNfts.length;
  }
}
