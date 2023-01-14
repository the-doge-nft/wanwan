import { makeObservable, observable } from "mobx";
import { Competition, Meme, SearchParams } from "../interfaces";
import http from "../services/http";
import AppStore from "./App.store";

export default class HomeStore {
  @observable
  memes: Meme[] = [];

  @observable
  competitions: Competition[] = [];

  constructor(
    memes: Meme[],
    competitions: Competition[],
    private readonly params: SearchParams
  ) {
    makeObservable(this);
    this.memes = memes;
    this.competitions = competitions;
  }

  init() {
    AppStore.events.subscribe(
      AppStore.events.events.MEME_CREATED,
      this,
      "getMemes" as keyof this
    );
    AppStore.events.subscribe(
      AppStore.events.events.COMPETITION_CREATED,
      this,
      "getCompetitions" as keyof this
    );
  }

  private getMemes() {
    return http
      .get("/meme/search", { params: this.params })
      .then(({ data }) => (this.memes = data.data));
  }

  private getCompetitions() {
    return http
      .get("/competition/search", { params: this.params })
      .then(({ data }) => (this.competitions = data.data));
  }

  destroy() {
    AppStore.events.unsubscribeAllFrom(this);
  }
}
