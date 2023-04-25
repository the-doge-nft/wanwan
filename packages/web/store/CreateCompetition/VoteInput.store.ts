import { Nft } from "alchemy-sdk";
import { action, computed, makeObservable, observable } from "mobx";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import { TokenType } from "../../interfaces";
import Http from "../../services/http";

export enum VoteInputView {
  Choose = "choose",
  Wallet = "wallet",
  Manual = "manual",
}

export default class VoteInputStore {
  @observable
  tokenType = TokenType.ERC721;

  @observable
  view: VoteInputView = VoteInputView.Choose;

  @observable
  contractAddress?: string = undefined;

  @observable
  holdersLength?: number = undefined;

  @observable
  nfts: Nft[] = [];

  @observable
  name?: string = undefined;

  @observable
  isLoadingHolders = false;

  @observable
  isLoadingNfts = false;

  @observable
  isConfirmed = false;

  constructor() {
    makeObservable(this);
  }

  @action
  setInput(address: string, tokenType: TokenType, name?: string) {
    this.contractAddress = address;
    this.tokenType = tokenType;
    this.name = name;
    this.getHolders();
    this.getNfts();
  }

  @action
  getHolders() {
    this.isLoadingHolders = true;
    return Http.getNftContractHolders(this.contractAddress!)
      .then(({ data }) => (this.holdersLength = data.owners.length))
      .finally(() => (this.isLoadingHolders = false));
  }

  @action
  getNfts() {
    this.isLoadingNfts = true;
    return Http.getNftsForContract(this.contractAddress!)
      .then(({ data }) => {
        this.nfts = data.nfts.filter((nft) => !!nft?.media[0]?.thumbnail);
      })
      .finally(() => (this.isLoadingNfts = false));
  }

  @computed
  get holderLengthTitle() {
    if (this.holdersLength === 50000) {
      return "50,000+";
    } else {
      return formatWithThousandsSeparators(this.holdersLength ?? 0);
    }
  }
}
