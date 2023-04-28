import { NftTokenType, OwnedNft } from "alchemy-sdk";
import { BigNumber } from "ethers";
import { computed, makeObservable, observable } from "mobx";
import { TokenBalance } from "../components/CreateCompetition/Wallet";
import { objectKeys } from "../helpers/arrays";
import { abbreviate } from "../helpers/strings";
import { ERC20Balance, Nullable, Wallet } from "../interfaces";

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
    selectedAddress?: Nullable<string>,
    nftsToFilter?: Array<OwnedNft>,
    balancesToFilter?: TokenBalance[]
  ) {
    makeObservable(this);
    this.wallet = wallet;
    this.showAll = showAll;

    if (selectedAddress) {
      this.selectedAddress = selectedAddress;
    }
    if (filterContractAddresses) {
      this.wallet = {
        nft: this.wallet?.nft?.filter(
          (nft) => !filterContractAddresses.includes(nft.contract.address)
        ),
        erc20: this.wallet?.erc20.filter((erc20) => {
          return !filterContractAddresses.includes(erc20.contractAddress);
        }),
        eth: this.wallet?.eth,
      };
    }

    if (nftsToFilter) {
      this.wallet.nft = this.wallet?.nft?.filter(
        (nft) =>
          !nftsToFilter.find(
            (nftToFilter) =>
              nftToFilter.contract.address === nft.contract.address &&
              nftToFilter.tokenId === nft.tokenId
          )
      );
    }

    if (balancesToFilter) {
      balancesToFilter.forEach((balance) => {
        if (balance.address === "eth") {
          this.wallet.eth = Number(
            Number(this.wallet.eth) - Number(balance.balance)
          ).toString();
        } else {
          const index = this.wallet.erc20.findIndex(
            (item) =>
              item.contractAddress.toLowerCase() ===
              balance.address.toLowerCase()
          );
          console.log("INDEX", index);
          console.log("TEST", this.wallet.erc20[index]);
          this.wallet.erc20[index].tokenBalance = BigNumber.from(
            this.wallet.erc20[index].tokenBalance
          )
            .sub(balance.balance)
            .toString();
        }
      });
    }

    // filter only for erc1155 and erc721
    this.wallet.nft = this.wallet.nft?.filter((nft) =>
      [NftTokenType.ERC1155, NftTokenType.ERC721].includes(
        nft.contract.tokenType
      )
    );
  }

  @computed
  get nftsByAddress() {
    const nfts: { [key: string]: Array<OwnedNft> } = {};
    this.wallet.nft?.forEach((nft) => {
      if (!nfts[nft.contract.address]) {
        nfts[nft.contract.address] = [nft];
      } else {
        nfts[nft.contract.address].push(nft);
      }
    });
    return nfts;
  }

  @computed
  get erc20ByAddress() {
    const erc20: { [key: string]: Array<ERC20Balance> } = {};
    this.wallet.erc20.forEach((token) => {
      if (!erc20[token.contractAddress]) {
        erc20[token.contractAddress] = [token];
      } else {
        erc20[token.contractAddress].push(token);
      }
    });
    return erc20;
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
  get selectedERC20Balances() {
    if (this.selectedAddress == "all") {
      return this.wallet.erc20;
    } else {
      return this.wallet.erc20.filter(
        (erc20) => erc20.contractAddress === this.selectedAddress
      );
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

  getSelectedERC20TokensCount(address: string | number) {
    if (address === "all") {
      return this.wallet.erc20.length;
    } else {
      return this.erc20ByAddress[address].length;
    }
  }

  getNftContractTitle(address: string | number) {
    if (address === "all") {
      return "All";
    }
    const contract = this.nftsByAddress[address][0].contract;
    if (contract.name) {
      return contract.name;
    }
    return abbreviate(contract.address);
  }

  getErc20ContractTitle(address: string | number) {
    if (address === "all") {
      return "All";
    }
    const contract = this.erc20ByAddress[address][0];
    if (contract.metadata?.name) {
      return contract.metadata?.name;
    }
    return abbreviate(contract.contractAddress);
  }

  @computed
  get hasNfts() {
    return objectKeys(this.nftsByAddress).length > 0;
  }

  @computed
  get hasERC20s() {
    return this.wallet.erc20.length > 0;
  }

  @computed
  get allNfts() {
    return this.wallet.nft;
  }

  @computed
  get hasEthBalance() {
    if (!this.wallet.eth) {
      return false;
    }
    return Number(this.wallet.eth) > 0;
  }

  @computed
  get hasTokenBalances() {
    return this.hasERC20s || this.hasEthBalance;
  }
}
