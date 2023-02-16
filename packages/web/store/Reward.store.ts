import { computed, makeObservable } from "mobx";
import { Reward } from "../interfaces";
import { newHttp } from "./../services/http";

export default class RewardStore {
  constructor(private readonly reward: Reward) {
    console.log("debug:: reward", reward);
    makeObservable(this);
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
