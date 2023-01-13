import { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import { computed, makeObservable, observable } from "mobx";
import { Address } from "wagmi";
import { encodeBase64 } from "../helpers/strings";
import http from "../services/http";
import { Reactionable } from "../services/mixins/reactionable";
import { Meme, Profile } from "./../interfaces/index";
import { EmptyClass } from "./../services/mixins/index";
import AppStore from "./App.store";

export default class AuthStore extends Reactionable(EmptyClass) {
  @observable
  status: AuthenticationStatus = "loading";

  // must be explicit undefined for mobx react to fire
  @observable
  address?: Address = undefined;

  @observable
  profile?: Profile;

  @observable
  memes: Meme[] = [];

  constructor() {
    super();
    makeObservable(this);
  }

  init() {
    this.getStatus();
    return (
      this.react(
        () => this.address,
        () => {
          if (this.address) {
            this.getProfile();
            this.getUserMemes();
          }
        }
      ),
      { fireImmediately: true }
    );
  }

  getStatus() {
    http
      .get("/auth/status")
      .then(({ data: isLoggedIn }) => {
        this.status = isLoggedIn ? "authenticated" : "unauthenticated";
      })
      .catch((e) => {
        console.error(e);
        this.status = "unauthenticated";
      });
  }

  getProfile() {
    if (!this.address) {
      throw new Error("Address not available");
    }
    http
      .get(`/profile/${this.address}`)
      .then(({ data }) => (this.profile = data));
  }

  getUserMemes() {
    if (!this.address) {
      throw new Error("Address not available");
    }
    http
      .get("/meme/search", {
        params: {
          offset: 0,
          count: 1000,
          config: encodeBase64({
            filters: [
              { key: "address", operation: "equals", value: this.address },
            ],
          }),
        },
      })
      .then(({ data }) => (this.memes = data));
  }

  runOrAuthPrompt(fn: () => void) {
    if (this.status === "authenticated") {
      fn();
    } else {
      AppStore.modals.isAuthModalOpen = true;
    }
  }

  onLogin() {
    console.log("on login");
    this.getStatus();
    AppStore.events.publish(AppStore.events.events.LOGIN);
  }

  onLogout() {
    this.getStatus();
    AppStore.events.publish(AppStore.events.events.LOGOUT);
  }

  @computed
  get isAuthed() {
    return this.status === "authenticated";
  }

  destroy() {
    this.disposeReactions();
  }
}
