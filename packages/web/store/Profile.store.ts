import { action, computed, makeObservable, observable } from "mobx";
import Http from "../services/http";
import { errorToast } from "./../components/DSL/Toast/Toast";
import { Competition, Meme, Nullable, Profile } from "./../interfaces/index";
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

  @observable
  description: Nullable<string> = null;

  @observable
  externalUrl: Nullable<string> = null;

  @observable
  twitterUsername: Nullable<string> = null;

  constructor(profile: Profile, view: ProfileView) {
    makeObservable(this);
    this.profile = profile;
    this.description = this.profile.user.description;
    this.externalUrl = this.profile.user.externalUrl;
    this.twitterUsername = this.profile.user.twitterUsername;
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
    AppStore.events.subscribe(
      AppStore.events.events.PROFILE_UPDATED,
      this,
      "getProfileIfAuthed"
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

  getProfileIfAuthed(profile: any) {
    this.profile = profile;
    this.description = profile.user.description;
    this.externalUrl = profile.user.externalUrl;
    this.twitterUsername = profile.user.twitterUsername;
  }

  getUserMemes() {
    return Http.searchMeme({
      offset: 0,
      count: 1000,
      filters: [
        {
          key: "address",
          operation: "equals",
          value: this.profile.address,
        },
      ],
      sorts: [{ key: "createdAt", direction: "desc" }],
    })
      .then(({ data }) => {
        this.memes = data.data;
      })
      .catch(() => errorToast("Could not get memes"));
  }

  getUserCompetitions() {
    return Http.searchCompetition({
      offset: 0,
      count: 1000,
      filters: [
        {
          key: "address",
          operation: "equals",
          value: this.profile.address,
        },
      ],
      sorts: [{ key: "createdAt", direction: "desc" }],
    })
      .then(({ data }) => (this.competitions = data.data))
      .catch((e) => errorToast("Could not get competitions"));
  }

  @computed
  get data() {
    if (this.isMemeView) {
      return this.memes;
    } else if (this.isCompetitionView) {
      return this.competitions;
    }
    return [];
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
