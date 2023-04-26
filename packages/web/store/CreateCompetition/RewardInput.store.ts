import { makeObservable, observable } from "mobx";
import { Nullable, TokenType } from "./../../interfaces/index";

export default class RewardInputStore {
  @observable
  tokenType: Nullable<TokenType> = null;

  @observable
  contractAddress: Nullable<string> = null;

  @observable
  tokenId: Nullable<string> = null;

  @observable
  amount: Nullable<string> = null;

  constructor() {
    makeObservable(this);
  }
}
