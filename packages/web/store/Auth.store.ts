import { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import { computed, makeObservable, observable } from "mobx";
import { Address } from "wagmi";
import { Reactionable } from "../services/mixins/reactionable";
import { abbreviate } from "./../helpers/strings";
import { Meme, Profile } from "./../interfaces/index";
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
  profile: Profile | null = null;

  @observable
  memes: Array<Meme> = [];

  @observable
  hasLoggedIn = false;

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
          } else {
            this.profile = null;
            this.memes = [];
          }
        }
      ),
      { fireImmediately: true }
    );
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
      this.profile = data;
      return data;
    });
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

  runOrAuthPrompt(fn: () => void) {
    if (this.status === "authenticated") {
      fn();
    } else {
      AppStore.modals.isAuthModalOpen = true;
    }
  }

  onLoginSuccess(address: string) {
    this.address = address as Address;
    this.hasLoggedIn = true;
    this.getStatus();
    AppStore.events.publish(AppStore.events.events.LOGIN);
  }

  onLogoutSuccess() {
    this.address = null;
    this.getStatus();
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
    if (!this.profile?.address) {
      if (this.address) {
        return abbreviate(this.address);
      }
      return undefined;
    }
    if (this.profile?.ens) {
      return this.profile.ens;
    }
    return abbreviate(this.profile.address);
  }
}
