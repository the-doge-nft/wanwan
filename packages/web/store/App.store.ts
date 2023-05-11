import { makeObservable, observable } from "mobx";
import AuthStore from "./Auth.store";
import EventsStore from "./Events.store";
import ModalsStore from "./Modals.store";
import SettingsStore from "./Settings.store";

class AppStoreClass {
  @observable
  auth: AuthStore;

  @observable
  modals: ModalsStore;

  @observable
  settings: SettingsStore;

  @observable
  events: EventsStore;

  // @observable
  // rwd: RwdStore;

  constructor() {
    makeObservable(this);
    this.auth = new AuthStore();
    this.modals = new ModalsStore();
    this.settings = new SettingsStore();
    this.events = new EventsStore();
    // this.rwd = new RwdStore();
  }

  init() {
    this.auth.init();
    this.settings.init();
    // this.rwd.init();
  }

  destroy() {
    this.auth.destroy();
  }
}

const AppStore = new AppStoreClass();
export default AppStore;
