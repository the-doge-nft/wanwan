import { makeObservable, observable } from "mobx";
export default class ModalsStore {
  @observable
  isAuthModalOpen = false;

  @observable
  isCreateMemeModalOpen = false;

  @observable
  isCreateCompetitionModalOpen = false;

  constructor() {
    makeObservable(this);
  }
}
