import { computed, makeObservable, observable } from "mobx";
import { Meme, NextString, SearchParams } from "../interfaces";
import Http from "../services/http";
import SearchableDataProvider from "./SearchableDataProvider";

export enum View {
  Column = "column",
  Grid = "grid",
}

const LOCAL_STORAGE_KEY = "meme-view";
class MemePageStore extends SearchableDataProvider<Meme, {}[]> {
  @observable
  _view = View.Column;

  constructor(
    memes: Meme[],
    private readonly params: SearchParams,
    _next: NextString
  ) {
    super("memes-page", memes, _next);
    makeObservable(this);

    if (typeof window !== "undefined") {
      const storageView = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storageView) {
        this.view = storageView as View;
      } else {
        this.view = View.Column;
      }
    }
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

  @computed
  get view() {
    return this._view;
  }

  set view(view: View) {
    this._view = view;
    localStorage.setItem(LOCAL_STORAGE_KEY, view);
  }
}

export default MemePageStore;
