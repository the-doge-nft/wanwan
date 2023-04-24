import { action, makeObservable, observable } from "mobx";
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
  isLoading = false;

  constructor() {
    makeObservable(this);
  }

  @action
  setInput(address: string, tokenType: TokenType) {
    this.contractAddress = address;
    this.tokenType = tokenType;
    this.getHolders();
  }

  getHolders() {
    this.isLoading = true;
    return Http.getNftContractHolders(this.contractAddress!)
      .then(({ data }) => (this.holdersLength = data.owners.length))
      .finally(() => (this.isLoading = false));
  }
}
