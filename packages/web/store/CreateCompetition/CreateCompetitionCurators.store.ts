import { action, computed, makeObservable, observable } from "mobx";
export default class CreateCompetitionCuratorsStore {
  CREATOR_INPUT_PREFIX = "creator-input";

  @observable
  private _curatorsCount = 0;

  constructor() {
    makeObservable(this);
  }

  @action
  addCurator() {
    this._curatorsCount += 1;
  }

  @action
  removeCurator() {
    this._curatorsCount -= 1;
  }

  get isCuratorsVisible() {
    return this._curatorsCount > 0;
  }

  @computed
  get curatorCount() {
    return this._curatorsCount;
  }

  @computed
  get showRemoveCurator() {
    return this._curatorsCount >= 1;
  }

  @computed
  get canAddCurator() {
    return this._curatorsCount < 3;
  }
}
