import { NftTokenType, OwnedNft } from "alchemy-sdk";
import { action, computed, makeAutoObservable, observable } from "mobx";
import {
  abbreviate,
  getEtherscanURL,
  getOpenSeaURL,
} from "../../helpers/strings";
import { ERC20Balance, Nullable, TokenType } from "./../../interfaces/index";

export default class RewardInputStore {
  @observable
  tokenType: Nullable<TokenType> = null;

  @observable
  contractAddress: Nullable<string> = null;

  @observable
  tokenId: Nullable<string | number> = null;

  @observable
  amount: Nullable<string | number> = null;

  @observable
  selectedNft: OwnedNft | null = null;

  @observable
  isConfirmed = false;

  @observable
  maxAmount = 0;

  @observable
  name: Nullable<string> = null;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setSelectedToken(
    contractAddress: string,
    tokenType: TokenType,
    tokenId?: string | number
  ) {
    this.contractAddress = contractAddress;
    this.tokenType = tokenType;
    if (tokenId) {
      this.tokenId = tokenId;
    }
  }

  @action
  onNFTAddressSelected({
    address,
    nfts,
  }: {
    address: string;
    nfts: OwnedNft[];
  }) {
    this.contractAddress = address;
    this.maxAmount = 1;
    this.tokenId = null;
    this.name = null;
    this.selectedNft = null;

    const tokenType = nfts?.[0]?.tokenType;
    if (tokenType === NftTokenType.ERC1155) {
      this.tokenType = TokenType.ERC1155;
    } else {
      this.tokenType = TokenType.ERC721;
    }
  }

  @action
  setSelectedNft(nft: OwnedNft) {
    this.selectedNft = nft;
    this.contractAddress = nft.contract.address;
    this.tokenId = nft.tokenId;
    this.amount = 1;
    if (nft.tokenType === NftTokenType.ERC1155) {
      this.tokenType = TokenType.ERC1155;
    } else {
      this.tokenType = TokenType.ERC721;
    }
    this.name = nft.title;
  }

  @action
  setSelectedERC20({
    address,
    balance,
  }: {
    address: string;
    balance: ERC20Balance[];
  }) {
    this.contractAddress = address;
    this.tokenType = TokenType.ERC20;
    this.amount = "";
    // this.amount = balance;
  }

  @computed
  get selectedDisplayName() {
    if (this.name) {
      return this.name;
    } else if (this.tokenType === TokenType.ERC20) {
      if (this.contractAddress) {
        return abbreviate(this.contractAddress);
      }
    }
    return null;
  }

  @computed
  get showCanConfirm() {
    if (
      this.tokenType === TokenType.ERC721 ||
      this.tokenType === TokenType.ERC1155
    ) {
      return !!this.tokenId;
    }
    // @next-needs to be updated to balance check
    return !!this.amount;
  }

  @computed
  get externalUrl() {
    if (this.tokenType === TokenType.ERC20) {
      return getEtherscanURL(this.contractAddress!, "token");
    }
  }

  @computed
  get selectedTokenLink() {
    if (!this.contractAddress) {
      return null;
    }
    if (this.tokenType === TokenType.ERC20) {
      return getEtherscanURL(this.contractAddress!, "token");
    } else {
      if (!this.tokenId) {
        return null;
      }
      return getOpenSeaURL(this.contractAddress!, this.tokenId!);
    }
  }
}
