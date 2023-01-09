import { makeObservable, observable } from "mobx";
import AuthStore from "./Auth.store";

class AppStoreClass {
  @observable
  auth: AuthStore;

  constructor() {
    makeObservable(this);
    this.auth = new AuthStore();
  }

  init() {
    this.auth.init();
  }
}

const AppStore = new AppStoreClass();
export default AppStore;
