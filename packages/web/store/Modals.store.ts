import { makeObservable, observable } from "mobx";
export default class ModalsStore {
  @observable
  isAuthModalOpen = false;

  @observable
  isCreateMemeModalOpen = false;

  constructor() {
    makeObservable(this);
  }
}
