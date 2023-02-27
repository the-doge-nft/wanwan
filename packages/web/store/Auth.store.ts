import { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import { computed, makeObservable, observable } from "mobx";
import { Address } from "wagmi";
import { encodeBase64 } from "../helpers/strings";
import { Reactionable } from "../services/mixins/reactionable";
import { Meme, Profile } from "./../interfaces/index";
import { Http } from "./../services/http";
import { EmptyClass } from "./../services/mixins/index";
import AppStore from "./App.store";

export default class AuthStore extends Reactionable(EmptyClass) {
  @observable
  status: AuthenticationStatus = "loading";

  // must be explicit undefined for mobx react to fire
  @observable
  address?: Address = undefined;

  @observable
  profile?: Profile = undefined;

  @observable
  memes: Array<Meme> = [];

  constructor() {
    super();
    makeObservable(this);
  }

  init() {
    // this.getStatus();
    AppStore.events.subscribe(
      AppStore.events.events.MEME_CREATED,
      this,
      "getUserMemes"
    );
    return (
      this.react(
        () => this.address,
        () => {
          if (this.address) {
            console.log("debug:: auth runnint");
            this.getProfile();
            this.getUserMemes();
          } else {
            this.profile = undefined;
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
    console.log("getting profile");
    return Http.getProfile(this.address).then(({ data }) => {
      this.profile = data;
      return data;
    });
  }

  getUserMemes() {
    if (!this.address) {
      throw new Error("Address not available");
    }
    Http.searchMeme({
      offset: 0,
      // if the user has more than 100k we break
      count: 100000,
      config: encodeBase64({
        filters: [{ key: "address", operation: "equals", value: this.address }],
        sorts: [{ key: "createdAt", direction: "desc" }],
      }),
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
    this.getStatus();
    AppStore.events.publish(AppStore.events.events.LOGIN);
  }

  onLogoutSuccess() {
    this.address = undefined;
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
}
