import { action, computed, makeObservable, observable } from "mobx";
import Http from "../services/http";
import { errorToast } from "./../components/DSL/Toast/Toast";
import { Competition, Meme, Nullable, User } from "./../interfaces/index";
import AppStore from "./App.store";

export enum ProfileView {
  Meme = "meme",
  Competition = "competition",
  Likes = "likes",
}

export default class ProfileStore {
  @observable
  memes: Array<Meme> = [];

  @observable
  likedMemes: Array<Meme> = [];

  @observable
  competitions: Array<Competition> = [];

  @observable
  user: User;

  @observable
  view: ProfileView = ProfileView.Meme;

  @observable
  description: Nullable<string> = null;

  @observable
  externalUrl: Nullable<string> = null;

  @observable
  twitterUsername: Nullable<string> = null;

  constructor(
    profile: User,
    memes: Array<Meme>,
    competitions: Array<Competition>,
    view: ProfileView
  ) {
    makeObservable(this);
    this.user = profile;
    this.memes = memes;
    this.competitions = competitions;
    this.description = this.user.description;
    this.externalUrl = this.user.externalUrl;
    this.twitterUsername = this.user.twitterUsername;
    this.view = view;
  }

  init() {
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
    // @next -- PROFILE DATA IS NOT SET ON LOGIN, SO WE NEED TO WAIT FOR IT
    AppStore.events.subscribe(
      AppStore.events.events.LOGIN,
      this,
      "getLikesIfAuthed"
    );
    this.getLikesIfAuthed();
  }

  @action
  getLikesIfAuthed() {
    if (this.canViewLikes) {
      return Http.getAddressLikes(this.user.address).then(
        ({ data }) => (this.likedMemes = data)
      );
    }
  }

  getMemesIfAuthedUser() {
    if (AppStore.auth.address === this.user.address) {
      this.getUserMemes();
    }
  }

  getCompetitionsIfAuthedUser() {
    if (AppStore.auth.address === this.user.address) {
      this.getUserCompetitions();
    }
  }

  getProfileIfAuthed(profile: any) {
    this.user = profile;
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
          value: this.user.address,
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
          value: this.user.address,
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
    } else if (this.isLikesView) {
      return this.likedMemes;
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
  get isLikesView() {
    return this.view === ProfileView.Likes;
  }

  @computed
  get isLoading() {
    return false;
  }

  @action
  goToMemeView() {
    this.view = ProfileView.Meme;
    this.setUrl();
  }

  @action
  goToCompetitionView() {
    this.view = ProfileView.Competition;
    this.setUrl();
  }

  @action
  goToLikesView() {
    this.view = ProfileView.Likes;
    this.setUrl();
  }

  setUrl() {
    const newUrl = this.getUrl(this.view);
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl
    );
  }

  private getUrl(view: ProfileView) {
    return `/profile/${this.user.address}/${view}`;
  }

  @computed
  get canViewLikes() {
    return this.user.id === AppStore.auth.user?.id;
  }
}
