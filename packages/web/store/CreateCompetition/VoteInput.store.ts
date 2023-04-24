import { action, makeObservable, observable } from "mobx";
import { TokenType } from "../../interfaces";

export default class VoteInputStore {
  @observable
  tokenType = TokenType.ERC721;

  @observable
  contractAddress?: string = undefined;

  constructor() {
    makeObservable(this);
  }

  @action
  setAddress(address: string) {
    this.contractAddress = address;
  }

  @action
  setTokenType(tokenType: TokenType) {
    this.tokenType = tokenType;
  }
}
