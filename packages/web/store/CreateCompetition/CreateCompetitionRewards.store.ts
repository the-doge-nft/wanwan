import { makeObservable, observable } from "mobx";
import { Nullable } from "../../interfaces";
import Http from "../../services/http";
import RewardInputStore from "./RewardInput.store";

export default class CreateCompetitionRewardsStore {
  @observable
  wallet: Nullable<any> = null;

  @observable
  rewards: RewardInputStore[] = [];

  constructor() {
    makeObservable(this);
  }

  init() {
    return Http.getWallet().then(({ data }) => (this.wallet = data));
  }

  destroy() {}
}
