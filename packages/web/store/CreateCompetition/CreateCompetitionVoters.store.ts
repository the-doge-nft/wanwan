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
    this.votingRule = this.votingRule.filter((_, i) => i !== index);
  }

  @computed
  get canAddVote() {
    return this.votingRule.every(
      (voteInputStore) => voteInputStore.isConfirmed
    );
  }

  @computed
  get selectedAddresses() {
    const addresses: string[] = [];
    this.votingRule.forEach((store) => {
      if (store.contractAddress) {
        addresses.push(store.contractAddress);
      }
    });
    return addresses;
  }

  getAddressesToHide(index: number) {
    return this.selectedAddresses.filter((_, i) => i !== index);
  }

  @computed
  get allVotersConfirmed() {
    return this.votingRule.every(
      (voteInputStore) => voteInputStore.isConfirmed
    );
  }
}
