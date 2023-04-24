import { OwnedNft } from "alchemy-sdk";
import { computed, makeObservable, observable } from "mobx";
import { objectKeys } from "../helpers/arrays";
import { Wallet } from "../interfaces";

export enum WalletView {}

export default class WalletStore {
  @observable
  selectedAddress: string | null | number = null;

  @observable
  wallet: Wallet;

  @observable
  showAll: boolean = false;

  constructor(
    wallet: Wallet,
    showAll: boolean,
    filterContractAddresses?: Array<string>,
    selectedAddress?: string
  ) {
    makeObservable(this);
    this.wallet = wallet;
    this.showAll = showAll;

    if (selectedAddress) {
      this.selectedAddress = selectedAddress;
    }
    if (filterContractAddresses) {
      this.wallet = {
        nft: wallet.nft.filter(
          (nft) => !filterContractAddresses.includes(nft.contract.address)
        ),
        erc20: wallet.erc20.filter((erc20) => {
          return !filterContractAddresses.includes(erc20.contractAddress);
        }),
      };
    }
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

  getSelectedNftsCount(address: string | number) {
    if (address === "all") {
      return this.wallet.nft.length;
    } else {
      return this.nftsByAddress[address].length;
    }
  }
}
