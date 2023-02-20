import { computed, makeObservable, observable } from "mobx";
import { Reward } from "../interfaces";
import { newHttp } from "./../services/http";

export default class RewardStore {
  @observable
  reward: Reward;

  constructor(reward: Reward) {
    makeObservable(this);
    this.reward = reward;
    console.log("debug:: reward", this.reward);
  }

  updateReward({
    competitionId,
    txId,
  }: {
    competitionId: number;
    txId: string;
  }) {
    return newHttp.updateReward({
      competitionId,
      txId,
      rewardId: this.reward.id,
    });
  }

  @computed
  get txId() {
    return this.reward.txId;
  }

  @computed
  get hasTxId() {
    return !!this.txId;
  }
}
