import { action, computed, makeObservable, observable } from "mobx";
import { formatEthereumAddress } from "../helpers/strings";
import http from "../services/http";
import { Navigable } from "../services/mixins/navigable";
import { EmptyClass } from "./../services/mixins/index";
import AppStore from "./App.store";

export enum CreateCompetitionView {
  Create = "Create",
  Success = "Success",
}

export default class CreateCompetitionStore extends Navigable(EmptyClass) {
  CREATOR_INPUT_PREFIX = "creator-input";

  @observable
  private _curatorsCount = 0;

  @observable
  isLoading = false;

  constructor() {
    super();
    makeObservable(this);
    this.currentView = CreateCompetitionView.Create;
  }

  onCompetitionSubmit(values: any) {
    this.isLoading = true;
    const formValues = { ...values };
    const curators: string[] = [];
    const body: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(formValues)) {
      if (key.startsWith(this.CREATOR_INPUT_PREFIX)) {
        const formattedAddress = formatEthereumAddress(value as string);
        if (!curators.includes(formattedAddress)) {
          curators.push(formatEthereumAddress(value as string));
        }
      } else {
        body[key] = value;
      }
    }
    const rewards: string[] = [];
    body.curators = curators;
    body.rewards = rewards;
    body.maxUserSubmissions = parseInt(body.maxUserSubmissions);
    return http
      .post(`/competition`, body)
      .then(() => {
        this.isLoading = false;
        AppStore.events.publish(AppStore.events.events.COMPETITION_CREATED);
        this.currentView = CreateCompetitionView.Success;
      })
      .catch((e) => {
        this.isLoading = false;
        throw e;
      });
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
