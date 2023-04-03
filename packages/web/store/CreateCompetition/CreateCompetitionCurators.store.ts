import { action, computed, makeObservable, observable } from "mobx";
export default class CreateCompetitionCuratorsStore {
  CREATOR_INPUT_PREFIX = "creator-input";
  private maxCount = 3;

  @observable
  private _count = 0;

  @observable
  curators: string[] = [];

  constructor() {
    makeObservable(this);
  }

  @action
  add() {
    this._count += 1;
  }

  @action
  remove() {
    this._count -= 1;
  }

  get isCuratorsVisible() {
    return this._count > 0;
  }

  @computed
  get count() {
    return this._count;
  }

  @computed
  get canRemove() {
    return this._count >= 1;
  }

  @computed
  get canAdd() {
    return this._count < this.maxCount;
  }

  getKey(index: number) {
    return `${this.CREATOR_INPUT_PREFIX}-${index}`;
  }
}
