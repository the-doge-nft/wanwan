import { action, makeObservable, observable } from "mobx";
import { objectKeys } from "../../helpers/arrays";
import LocalStorage from "../../helpers/localStorage";

export default class CompetitionByIdPaneVisibilityStore {
  private getLocalStorageKey(key: string) {
    return `competition-pane-visibility-${key}-${this.id}`;
  }

  @observable
  submitContent = true;

  @observable
  title = true;

  @observable
  voters = true;

  @observable
  rewards = true;

  @observable
  details = true;

  @observable
  userEntries = true;

  constructor(private readonly id: number) {
    makeObservable(this);
  }

  init() {
    objectKeys(this).forEach((key) => {
      if (typeof this[key] === "boolean" && typeof key === "string") {
        this[key as keyof this] = LocalStorage.getItem(
          this.getLocalStorageKey(key),
          LocalStorage.PARSE_JSON,
          true
        );
      }
    });
  }

  @action
  set(key: keyof this, value: boolean) {
    this[key] = value as any;
    LocalStorage.setItem(this.getLocalStorageKey(key as string), value);
  }
}
