import { makeObservable, observable } from "mobx";
import { Competition, Meme, SearchParams } from "../interfaces";
import http from "../services/http";
import AppStore from "./App.store";

export default class HomeStore {
  @observable
  memes: Meme[] = [];

  @observable
  competitions: Competition[] = [];

  @observable
  isMemesLoading = false;

  @observable
  isCompetitionsLoading = false;

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
    this.isMemesLoading = true;
    return http
      .get("/meme/search", { params: this.params })
      .then(({ data }) => (this.memes = data.data))
      .finally(() => (this.isMemesLoading = false));
  }

  private getCompetitions() {
    this.isCompetitionsLoading = true;
    return http
      .get("/competition/search", { params: this.params })
      .then(({ data }) => (this.competitions = data.data))
      .finally(() => (this.isCompetitionsLoading = false));
  }

  destroy() {
    AppStore.events.unsubscribeAllFrom(this);
  }
}
