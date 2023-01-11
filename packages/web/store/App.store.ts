import { makeObservable, observable } from "mobx";
import AuthStore from "./Auth.store";
import ModalsStore from "./Modals.store";
import SettingsStore from "./Settings.store";

class AppStoreClass {
  @observable
  auth: AuthStore;

  @observable
  modals: ModalsStore;

  @observable
  settings: SettingsStore;

  constructor() {
    makeObservable(this);
    this.auth = new AuthStore();
    this.modals = new ModalsStore();
    this.settings = new SettingsStore();
  }

  init() {
    this.auth.init();
    this.settings.init();
  }
}

const AppStore = new AppStoreClass();
export default AppStore;
