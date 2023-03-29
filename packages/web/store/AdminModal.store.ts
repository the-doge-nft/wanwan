import { makeObservable, observable } from "mobx";
import Http from "../services/http";
import { Meme, Nullable, Tweet } from "./../interfaces/index";
class AdminModalStore {
  @observable
  meme: Nullable<Meme> = null;

  @observable
  tweet: Nullable<Tweet> = null;

  @observable
  isLoading = false;

  @observable
  buttonText = "send tweet";

  constructor() {
    makeObservable(this);
  }

  postTweet() {
    this.isLoading = true;
    return Http.getAdminTweet()
      .then(({ data }) => {
        this.meme = data.meme;
        this.tweet = data.tweet;
        this.buttonText = "tweet another";
      })
      .finally(() => (this.isLoading = false));
  }
}

export default AdminModalStore;
