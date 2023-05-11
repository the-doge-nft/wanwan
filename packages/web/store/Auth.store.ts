import { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import { action, computed, makeObservable, observable } from "mobx";
import { Address } from "wagmi";
import { Reactionable } from "../services/mixins/reactionable";
import { abbreviate } from "./../helpers/strings";
import { Meme, User } from "./../interfaces/index";
import Http from "./../services/http";
import { EmptyClass } from "./../services/mixins/index";
import AppStore from "./App.store";

export default class AuthStore extends Reactionable(EmptyClass) {
  @observable
  status: AuthenticationStatus = "unauthenticated";

  // must be explicit undefined for mobx react to fire
  @observable
  address: Address | null = null;

  @observable
  user: User | null = null;

  @observable
  memes: Array<Meme> = [];

  @observable
  isLoggedIn = false;

  @observable
  isAdmin = false;

  @observable
  memeIdsLiked: Array<number> = [];

  constructor() {
    super();
    makeObservable(this);
  }

  init() {
    this.getStatus();
    AppStore.events.subscribe(
      AppStore.events.events.MEME_CREATED,
      this,
      "getUserMemes"
    );
    AppStore.events.subscribe(
      AppStore.events.events.PROFILE_UPDATED,
      this,
      "updateProfile"
    );
    return (
      this.react(
        () => this.address,
        () => {
          if (this.address) {
            this.getProfile();
            this.getUserMemes();
            this.getIsAdmin();
            this.getLikedMemeIds();
          } else {
            this.user = null;
            this.memes = [];
          }
        }
      ),
      { fireImmediately: true }
    );
  }

  updateProfile(data: User) {
    this.user = data;
  }

  getStatus({
    onAuthed,
    onUnauthed,
  }: {
    onAuthed?: () => void;
    onUnauthed?: () => void;
  } = {}) {
    Http.getStatus()
      .then(({ data: isLoggedIn }) => {
        this.status = isLoggedIn ? "authenticated" : "unauthenticated";
        if (this.status === "authenticated") {
          onAuthed && onAuthed();
          this.getIsAdmin();
        } else if (this.status === "unauthenticated") {
          onUnauthed && onUnauthed();
        }
      })
      .catch((e) => {
        console.error(e);
        this.status = "unauthenticated";
        onUnauthed && onUnauthed();
      });
  }

  getProfile() {
    if (!this.address) {
      throw new Error("Address not available");
    }
    return Http.getProfile(this.address).then(({ data }) => {
      this.user = data;
      return data;
    });
  }

  getIsAdmin() {
    return Http.getIsAdmin()
      .then(({ data }) => {
        this.isAdmin = data;
        return data;
      })
      .catch(() => console.error);
  }

  getUserMemes() {
    if (!this.address) {
      throw new Error("Address not available");
    }
    return Http.searchMeme({
      offset: 0,
      // if the user has more than 100k we break
      count: 100000,
      filters: [{ key: "address", operation: "equals", value: this.address }],
      sorts: [{ key: "createdAt", direction: "desc" }],
    }).then(({ data }) => (this.memes = data.data));
  }

  @action
  getLikedMemeIds() {
    return Http.getAddressLikes(this.address!).then(
      ({ data }) => (this.memeIdsLiked = data.map((meme) => meme.id))
    );
  }

  runOrAuthPrompt(fn: () => any) {
    if (this.status === "authenticated") {
      fn();
    } else {
      AppStore.modals.isAuthModalOpen = true;
      return;
    }
  }

  onLoginSuccess(address: string) {
    this.address = address as Address;
    this.isLoggedIn = true;
    this.getStatus();
    AppStore.events.publish(AppStore.events.events.LOGIN);
  }

  onLogoutSuccess() {
    this.address = null;
    this.isLoggedIn = false;
    this.getStatus();
    this.getIsAdmin();
    AppStore.events.publish(AppStore.events.events.LOGOUT);
  }

  onAccountSwitch() {
    return this.logout();
  }

  logout() {
    return Http.logout()
      .then(() => this.onLogoutSuccess())
      .catch((e) => console.warn("already logged out"));
  }

  destroy() {
    this.disposeReactions();
  }

  @computed
  get isAuthed() {
    return this.status === "authenticated";
  }

  @computed
  get displayName() {
    if (!this.user?.address) {
      if (this.address) {
        return abbreviate(this.address);
      }
      return undefined;
    }
    if (this.user?.ens) {
      return this.user.ens;
    }
    return abbreviate(this.user.address);
  }
}
