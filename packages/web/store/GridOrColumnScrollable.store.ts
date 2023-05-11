import { computed, makeObservable, observable } from "mobx";
import LocalStorage from "../helpers/localStorage";
import { NextString, SearchParams, SearchResponse } from "../interfaces";
import SearchableDataProvider from "./SearchableDataProvider";

export enum View {
  Column = "column",
  Grid = "grid",
}

abstract class GridOrColumnScrollableStore<T> extends SearchableDataProvider<
  T,
  string
> {
  abstract localStorageKey: string;

  @observable
  private _view = View.Column;

  constructor(
    cancelTokensName: string,
    intialData: T[],
    next: NextString,
    private readonly params: SearchParams
  ) {
    super(cancelTokensName, intialData, next);
    makeObservable(this);
  }

  init() {
    this.view = LocalStorage.getItem(
      this.localStorageKey,
      LocalStorage.PARSE_STRING,
      this.view ? this.view : View.Column
    ) as View;
  }

  abstract query(): Promise<SearchResponse<T>>;

  @computed
  get view() {
    return this._view;
  }

  set view(view: View) {
    this._view = view;
    LocalStorage.setItem(this.localStorageKey, view);
  }

  protected getDefaultFilters() {
    return this.params.filters;
  }

  protected getDefaultSorts() {
    return this.params.sorts;
  }
}

export default GridOrColumnScrollableStore;
