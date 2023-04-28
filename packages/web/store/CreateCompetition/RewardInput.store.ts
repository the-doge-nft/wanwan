import { NftTokenType, OwnedNft } from "alchemy-sdk";
import { action, computed, makeAutoObservable, observable } from "mobx";
import {
  abbreviate,
  getEtherscanURL,
  getOpenSeaURL,
} from "../../helpers/strings";
import AppStore from "../App.store";
import { ERC20Balance, Nullable, TokenType } from "./../../interfaces/index";

export default class RewardInputStore {
  @observable
  tokenType: Nullable<TokenType> = null;

  @observable
  contractAddress: Nullable<string> = null;

  @observable
  tokenId: Nullable<string | number> = null;

  @observable
  amount: string = "";

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
  onEthSelected() {
    this.tokenType = TokenType.ETH;
    this.contractAddress = "eth";
    this.tokenId = null;
    this.amount = "";
    this.name = "ETH";
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
    this.amount = "1";
    if (nft.tokenType === NftTokenType.ERC1155) {
      this.tokenType = TokenType.ERC1155;
    } else {
      this.tokenType = TokenType.ERC721;
    }
    if (nft.title) {
      this.name = nft.title;
    } else {
      this.name = `${nft.contract.name} #${nft.tokenId}`;
    }
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
    this.name = balance?.[0]?.metadata.name;
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
    } else if (this.tokenType === TokenType.ETH) {
      return "ETH";
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
    return false;
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
    } else if (this.tokenType === TokenType.ETH) {
      return getEtherscanURL(AppStore.auth.address as string, "address");
    } else {
      if (!this.tokenId) {
        return null;
      }
      return getOpenSeaURL(this.contractAddress!, this.tokenId!);
    }
  }

  @computed
  get isNFT() {
    return (
      (this.tokenType === TokenType.ERC1155 ||
        this.tokenType === TokenType.ERC721) &&
      this.tokenType !== null
    );
  }
}
