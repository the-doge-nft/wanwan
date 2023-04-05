import { action, computed, makeObservable, observable } from "mobx";
import CuratorInputStore from "./CuratorInput.store";
export default class CreateCompetitionCuratorsStore {
  private maxCount = 3;

  @observable
  curators: CuratorInputStore[] = [];

  constructor() {
    makeObservable(this);
  }

  @action
  addCurator() {
    this.curators.push(new CuratorInputStore());
  }

  get isCuratorsVisible() {
    return this.curators.length > 0;
  }

  @computed
  get canRemove() {
    return this.curators.length >= 1;
  }

  @computed
  get canAdd() {
    return this.curators.length < this.maxCount;
  }

  @action
  removeCurator(index: number) {
    this.curators.splice(index, 1);
  }

  destroy() {
    this.curators.forEach((curator) => curator.destroy());
  }
}
