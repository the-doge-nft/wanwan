import { action, computed, makeObservable, observable } from "mobx";
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

  @action
  addReward() {
    this.rewards.push(new RewardInputStore());
  }

  @action
  removeReward(index: number) {
    this.rewards.splice(index, 1);
  }

  get isRewardsVisible() {
    return this.rewards.length > 0;
  }

  @computed
  get rewardsCount() {
    return this.rewards.length;
  }

  @computed
  get showRemoveReward() {
    return this.rewards.length >= 1;
  }

  @computed
  get canAddReward() {
    return this.rewards.length < 3;
  }

  destroy() {}
}
