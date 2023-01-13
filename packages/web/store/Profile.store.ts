import { Competition } from "@prisma/client";
import { computed, makeObservable, observable } from "mobx";
import { encodeBase64 } from "../helpers/strings";
import http from "../services/http";
import { Meme, Profile } from "./../interfaces/index";
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
  selectedView: ProfileView = ProfileView.Meme;

  constructor(profile: Profile) {
    makeObservable(this);
    this.profile = profile;
  }

  init() {
    this.getUserMemes();
    AppStore.events.subscribe(
      AppStore.events.events.MEME_CREATED,
      this,
      "getMemesIfAuthedUser"
    );
  }

  getMemesIfAuthedUser() {
    if (AppStore.auth.address === this.profile.address) {
      this.getUserMemes();
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
        console.log(this.memes);
      });
  }

  getUserCompetitions() {
    return http.get("/competition/search", {
      params: {
        offset: 0,
        count: 10,
        config: encodeBase64({
          filters: [{ key: "" }],
          sorts: [{ key: "crateAt", direction: "desc" }],
        }),
      },
    });
  }

  @computed
  get hasData() {
    if (this.selectedView === ProfileView.Meme) {
      return this.memes.length > 0;
    } else if (this.selectedView === ProfileView.Competition) {
      return this.competitions.length > 0;
    }
    return false;
  }

  @computed
  get isLoading() {
    return false;
  }
}
