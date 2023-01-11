import { action, computed, makeObservable, observable } from "mobx";
import http from "../services/http";
import { Navigable } from "../services/mixins/navigable";
import { EmptyClass } from "./../services/mixins/index";

export enum CreateCompetitionView {
  Create = "Create",
  Success = "Success",
}

export default class CreateCompetitionStore extends Navigable(EmptyClass) {
  CREATOR_INPUT_PREFIX = "creator";

  @observable
  private _curatorsCount = 0;

  constructor() {
    super();
    makeObservable(this);
    this.currentView = CreateCompetitionView.Create;
  }

  onCompetitionSubmit(values: any) {
    return http.post(`/competition`, { ...values });
  }

  @computed
  get title() {
    switch (this.currentView) {
      case CreateCompetitionView.Create:
        return "Create Competition";
      case CreateCompetitionView.Success:
        return "Competition Created";
      default:
        return "";
    }
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
}
