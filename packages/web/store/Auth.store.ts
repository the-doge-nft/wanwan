import { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import { makeObservable, observable } from "mobx";
import http from "../services/http";

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
}
