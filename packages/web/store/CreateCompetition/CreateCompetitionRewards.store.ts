import { action, computed, makeObservable, observable } from "mobx";
import { objectKeys } from "../../helpers/arrays";
import { CurrencyType } from "../../interfaces";
import { EmptyClass } from "../../services/mixins";
import { Reactionable } from "../../services/mixins/reactionable";
import RewardInputStore from "./RewardInput.store";

export default class CreateCompetitionRewardsStore extends Reactionable(
  EmptyClass
) {
  private MAX_COUNT_REWARDS = 10;

  @observable
  rewards: RewardInputStore[] = [];

  constructor() {
    super();
    makeObservable(this);
  }

  @action
  addReward() {
    this.rewards = [...this.rewards, new RewardInputStore()];
  }

  @action
  removeReward(index: number) {
    this.rewards = this.rewards.filter((_, i) => i !== index);
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
    return this.rewards.length < this.MAX_COUNT_REWARDS && this.allConfirmed;
  }

  @computed
  get allConfirmed() {
    return this.rewards.every((store) => store.isConfirmed);
  }

  @computed
  get tokenAddressesToFilter() {
    return this.rewards
      .filter((address) => !!address)
      .map((reward) => reward.contractAddress);
  }

  getNftsToHide(index: number) {
    const voteInputsBefore = this.rewards.filter((item, i) => i !== index);
    return voteInputsBefore
      .filter((input) => input.selectedNft)
      .map((input) => input.selectedNft!);
  }

  getBalancesToHide(index: number) {
    const balancesToFilter: { [key: string]: string } = {};
    const rewardStores = this.rewards
      .filter((item, i) => i !== index)
      .filter(
        (input) =>
          (input.tokenType === CurrencyType.ERC20 && input.contractAddress) ||
          input.tokenType === CurrencyType.ETH
      );
    rewardStores.forEach((store) => {
      if (store.tokenType === CurrencyType.ETH) {
        if (balancesToFilter?.eth) {
          balancesToFilter["eth"] = Number(
            Number(balancesToFilter["eth"]) + Number(store.amount)
          ).toString();
        } else {
          balancesToFilter["eth"] = store.amount;
        }
      } else {
        if (balancesToFilter[store.contractAddress!]) {
          balancesToFilter[store.contractAddress!] = Number(
            Number(balancesToFilter[store.contractAddress!]) +
              Number(store.amount)
          ).toString();
        } else {
          balancesToFilter[store.contractAddress!] = store.amount;
        }
      }
    });
    return objectKeys(balancesToFilter).map((key) => ({
      address: key as string,
      balance: balancesToFilter[key],
    }));
  }

  @computed
  get hasRewards() {
    return this.rewards.length > 0;
  }
}
