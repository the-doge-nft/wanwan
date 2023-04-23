import { makeObservable, observable } from "mobx";
import { TokenType } from "../../interfaces";

export default class VoteInputStore {
  @observable
  tokenType = TokenType.ERC20;

  constructor() {
    makeObservable(this);
  }
}
