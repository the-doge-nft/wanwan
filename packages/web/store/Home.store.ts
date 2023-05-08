import { makeObservable, observable } from "mobx";
import { Competition, Meme, SearchParams, Stats } from "../interfaces";
import Http from "../services/http";
import AppStore from "./App.store";

export default class HomeStore {
  @observable
  memes: Meme[] = [];

  @observable
  competitions: Competition[] = [];

  @observable
  stats: Stats;

  private params: SearchParams;

  constructor(
    memes: Meme[],
    competitions: Competition[],
    stats: Stats,
    searchParams: SearchParams
  ) {
    makeObservable(this);
    this.memes = memes;
    this.competitions = competitions;
    this.stats = stats;
    this.params = searchParams;
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
    AppStore.events.subscribe(
      AppStore.events.events.MEME_CREATED,
      this,
      "getStats" as keyof this
    );
    AppStore.events.subscribe(
      AppStore.events.events.COMPETITION_CREATED,
      this,
      "getStats" as keyof this
    );
  }

  private getMemes() {
    return Http.searchMeme(this.params).then(
      ({ data }) => (this.memes = data.data)
    );
  }

  private getCompetitions() {
    return Http.searchCompetition(this.params).then(
      ({ data }) => (this.competitions = data.data)
    );
  }

  private getStats() {
    return Http.stats().then(({ data }) => (this.stats = data));
  }

  destroy() {
    AppStore.events.unsubscribeAllFrom(this);
  }
}
