import { action, computed, makeObservable, observable } from "mobx";
import { encodeBase64 } from "../helpers/strings";
import http from "../services/http";
import { errorToast } from "./../components/DSL/Toast/Toast";
import { Competition, Meme, Profile } from "./../interfaces/index";
import AppStore from "./App.store";

export enum ProfileView {
  Meme = "meme",
  Competition = "competition",
}

export default class ProfileStore {
  @observable
  memes: Array<Meme> = [];

  @observable
  competitions: Array<Competition> = [];

  @observable
  profile: Profile;

  @observable
  view: ProfileView = ProfileView.Meme;

  constructor(profile: Profile, view: ProfileView) {
    makeObservable(this);
    this.profile = profile;
    this.view = view;
  }

  init() {
    this.getUserMemes();
    this.getUserCompetitions();
    AppStore.events.subscribe(
      AppStore.events.events.MEME_CREATED,
      this,
      "getMemesIfAuthedUser"
    );
    AppStore.events.subscribe(
      AppStore.events.events.COMPETITION_CREATED,
      this,
      "getCompetitionsIfAuthedUser"
    );
  }

  getMemesIfAuthedUser() {
    if (AppStore.auth.address === this.profile.address) {
      this.getUserMemes();
    }
  }

  getCompetitionsIfAuthedUser() {
    if (AppStore.auth.address === this.profile.address) {
      this.getUserCompetitions();
    }
  }

  getUserMemes() {
    return http
      .get(`/meme/search`, {
        params: {
          offset: 0,
          count: 10,
          config: encodeBase64({
            filters: [
              {
                key: "address",
                operation: "equals",
                value: this.profile.address,
              },
            ],
            sorts: [{ key: "createdAt", direction: "desc" }],
          }),
        },
      })
      .then(({ data }) => {
        this.memes = data.data;
      })
      .catch(() => errorToast("Could not get memes"));
  }

  getUserCompetitions() {
    return http
      .get("/competition/search", {
        params: {
          offset: 0,
          count: 10,
          config: encodeBase64({
            filters: [
              {
                key: "address",
                operation: "equals",
                value: this.profile.address,
              },
            ],
            sorts: [{ key: "createdAt", direction: "desc" }],
          }),
        },
      })
      .then(({ data }) => (this.competitions = data.data))
      .catch((e) => errorToast("Could not get competitions"));
  }

  @computed
  get hasData() {
    if (this.isMemeView) {
      return this.memes.length > 0;
    } else if (this.isCompetitionView) {
      return this.competitions.length > 0;
    }
    return false;
  }

  @computed
  get isMemeView() {
    return this.view === ProfileView.Meme;
  }

  @computed
  get isCompetitionView() {
    return this.view === ProfileView.Competition;
  }

  @computed
  get isLoading() {
    return false;
  }

  @action
  goToMemeView() {
    this.view = ProfileView.Meme;
    const newUrl = this.getUrl(ProfileView.Meme);
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl
    );
  }

  @action
  goToCompetitionView() {
    this.view = ProfileView.Competition;
    const newUrl = this.getUrl(ProfileView.Competition);
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl
    );
  }

  private getUrl(view: ProfileView) {
    return `/profile/${this.profile.address}/${view}`;
  }
}
