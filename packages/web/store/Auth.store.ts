import { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import { computed, makeObservable, observable } from "mobx";
import http from "../services/http";
import AppStore from "./App.store";

export default class AuthStore {
  @observable
  status: AuthenticationStatus = "loading";

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

  runOrAuthPrompt(fn: () => void) {
    if (this.status === "authenticated") {
      fn();
    } else {
      AppStore.modals.isAuthModalOpen = true;
    }
  }

  @computed
  get isAuthed() {
    return this.status === "authenticated";
  }
}
