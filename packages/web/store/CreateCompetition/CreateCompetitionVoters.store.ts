import { computed, makeObservable, observable } from "mobx";

export default class CreateCompetitionVoteStore {
  @observable
  votingRule = [];

  constructor() {
    makeObservable(this);
  }

  @computed
  get hasVoters() {
    return this.votingRule.length > 0;
  }
}
