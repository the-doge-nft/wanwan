import { makeObservable, observable } from "mobx";
import { encodeBase64 } from "../helpers/strings";
import http from "../services/http";
import { Meme, Profile } from "./../interfaces/index";

export default class ProfileStore {
  @observable
  memes: Array<Meme> = [];

  @observable
  profile: Profile;

  constructor(profile: Profile) {
    makeObservable(this);
    this.profile = profile;
  }

  init() {
    http
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
          }),
        },
      })
      .then(({ data }) => {
        this.memes = data.data;
        console.log(this.memes);
      });
  }
}
