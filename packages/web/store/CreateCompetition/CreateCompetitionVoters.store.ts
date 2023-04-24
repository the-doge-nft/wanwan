import { action, computed, makeObservable, observable } from "mobx";
import VoteInputStore from "./VoteInput.store";

export default class CreateCompetitionVoteStore {
  @observable
  votingRule: VoteInputStore[] = [];

  constructor() {
    makeObservable(this);
  }

  @computed
  get hasVoters() {
    return this.votingRule.length > 0;
  }

  @action
  addVoter() {
    this.votingRule.push(new VoteInputStore());
  }

  @action
  removeVote(index: number) {
    this.votingRule.splice(index, 1);
  }

  @computed
  get canAddVote() {
    return this.votingRule.every(
      (voteInputStore) => voteInputStore.isConfirmed
    );
  }
}
