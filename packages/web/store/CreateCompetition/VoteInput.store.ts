import { action, computed, makeObservable, observable } from "mobx";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import { TokenType } from "../../interfaces";
import Http from "../../services/http";

export default class VoteInputStore {
  @observable
  tokenType = TokenType.ERC721;

  @observable
  contractAddress?: string = undefined;

  @observable
  holdersLength?: number = undefined;

  @observable
  name?: string = undefined;

  @observable
  isLoading = false;

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
  }

  getHolders() {
    this.isLoading = true;
    return Http.getNftContractHolders(this.contractAddress!)
      .then(({ data }) => (this.holdersLength = data.owners.length))
      .finally(() => (this.isLoading = false));
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
