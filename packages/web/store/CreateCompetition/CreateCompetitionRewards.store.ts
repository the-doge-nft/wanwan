import { action, computed, makeObservable, observable } from "mobx";
import RewardInputStore from "./RewardInput.store";

export default class CreateCompetitionRewardsStore {
  @observable
  rewards: RewardInputStore[] = [];

  constructor() {
    makeObservable(this);
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
}
