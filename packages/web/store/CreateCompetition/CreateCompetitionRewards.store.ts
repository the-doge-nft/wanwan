import { action, computed, makeObservable, observable } from "mobx";
import { TokenType } from "../../interfaces";
import { EmptyClass } from "../../services/mixins";
import { Reactionable } from "../../services/mixins/reactionable";
import RewardInputStore from "./RewardInput.store";

export default class CreateCompetitionRewardsStore extends Reactionable(
  EmptyClass
) {
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
    return this.rewards.length < 10;
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
    const voteInputsBefore = this.rewards.filter((item, i) => i !== index);
    return voteInputsBefore
      .filter(
        (input) =>
          input.tokenType === TokenType.ERC20 ||
          input.tokenType === TokenType.ETH
      )
      .map((input) => ({
        address: input.contractAddress as string,
        balance: input.amount,
      }));
  }
}
