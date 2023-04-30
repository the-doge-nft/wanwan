import { computed, makeObservable, observable } from "mobx";
import isClient from "../helpers/isClient";
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
    this.initView();
  }

  private initView() {
    if (isClient()) {
      const view = localStorage.getItem(this.localStorageKey);
      if (view) {
        this.view = view as View;
      }
    }
  }

  abstract query(): Promise<SearchResponse<T>>;

  @computed
  get view() {
    return this._view;
  }

  set view(view: View) {
    this._view = view;
    localStorage.setItem(this.localStorageKey, view);
  }

  protected getDefaultFilters() {
    return this.params.filters;
  }

  protected getDefaultSorts() {
    return this.params.sorts;
  }
}

export default GridOrColumnScrollableStore;
