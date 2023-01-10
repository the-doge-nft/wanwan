import { makeObservable, observable } from "mobx";
import AuthStore from "./Auth.store";
import ModalsStore from "./Modals.store";

class AppStoreClass {
  @observable
  auth: AuthStore;

  @observable
  modals: ModalsStore;

  constructor() {
    makeObservable(this);
    this.auth = new AuthStore();
    this.modals = new ModalsStore();
  }

  init() {
    this.auth.init();
  }
}

const AppStore = new AppStoreClass();
export default AppStore;
