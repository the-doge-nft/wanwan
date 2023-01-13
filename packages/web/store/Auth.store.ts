import { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import { computed, makeObservable, observable } from "mobx";
import { Address } from "wagmi";
import http from "../services/http";
import { Profile } from "./../interfaces/index";
import AppStore from "./App.store";

export default class AuthStore {
  @observable
  status: AuthenticationStatus = "loading";

  @observable
  address?: Address;

  @observable
  profile?: Profile;

  constructor() {
    makeObservable(this);
  }

  init() {
    this.getStatus();
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
    if (this.address) {
      http
        .get(`/profile/${this.address}`)
        .then(({ data }) => (this.profile = data));
    }
  }

  runOrAuthPrompt(fn: () => void) {
    if (this.status === "authenticated") {
      fn();
    } else {
      AppStore.modals.isAuthModalOpen = true;
    }
  }

  onLogin() {
    this.getStatus();
    this.getProfile();
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
}
