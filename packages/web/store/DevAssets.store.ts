import { makeObservable, observable } from "mobx";

export default class DevAssetsStore {
  @observable
  erc1155TokenId = "0";

  @observable
  erc1155Amount = "1";

  @observable
  erc20Amount = "100";

  constructor() {
    makeObservable(this);
  }

  onERC20Submit() {}
}
