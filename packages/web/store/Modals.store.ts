import { makeObservable, observable } from "mobx";
export default class ModalsStore {
  @observable
  isAuthModalOpen = false;

  @observable
  isCreateMemeModalOpen = false;

  @observable
  isCreateCompetitionModalOpen = false;

  @observable
  isSettingsModalOpen = false;

  @observable
  isAdminModalOpen = false;

  constructor() {
    makeObservable(this);
  }
}
