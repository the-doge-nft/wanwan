import { makeObservable, observable } from "mobx";
import { Competition, Meme, SearchParams } from "../interfaces";
import Http from "../services/http";
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

  private params: SearchParams = {
    count: 12,
    offset: 0,
    sorts: [{ key: "createdAt", direction: "desc" }],
    filters: [],
  };

  constructor() {
    makeObservable(this);
  }

  init() {
    this.getMemes();
    this.getCompetitions();
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
    return Http.searchMeme(this.params)
      .then(({ data }) => (this.memes = data.data))
      .finally(() => (this.isMemesLoading = false));
  }

  private getCompetitions() {
    this.isCompetitionsLoading = true;
    return Http.searchCompetition(this.params)
      .then(({ data }) => (this.competitions = data.data))
      .finally(() => (this.isCompetitionsLoading = false));
  }

  destroy() {
    AppStore.events.unsubscribeAllFrom(this);
  }
}
