import { makeObservable } from "mobx";
import { Meme, NextString, SearchParams } from "../interfaces";
import Http from "../services/http";
import SearchableDataProvider from "./SearchableDataProvider";
class MemePageStore extends SearchableDataProvider<Meme, {}[]> {
  constructor(
    memes: Meme[],
    private readonly params: SearchParams,
    _next: NextString
  ) {
    super("memes-page", memes, _next);
    makeObservable(this);
  }

  protected getDefaultFilters(): any[] {
    return this.params.filters;
  }

  protected getDefaultSorts(): any[] {
    return this.params.sorts;
  }

  protected query() {
    return Http.searchMeme(this.getQueryConfig().params).then(
      ({ data }) => data
    );
  }
}

export default MemePageStore;
