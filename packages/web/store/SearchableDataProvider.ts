import { debounce } from "lodash";
import { computed, makeObservable, observable } from "mobx";
import { arrayMerge } from "../helpers/arrays";
import sleep from "../helpers/sleep";
import { jsonify } from "../helpers/strings";
import { NextString } from "../interfaces";
import Http from "../services/http";
import { EmptyClass } from "../services/mixins";
import { CancelableTokens } from "../services/mixins/cancel-tokens";
import { Loadable } from "../services/mixins/loadable";
import { Reactionable } from "../services/mixins/reactionable";
import { isDev } from "./../environment/vars";

type FilteringOperations = "contains" | "equals";

type SortingDirections = "asc" | "desc" | string;

abstract class SearchableDataProvider<T, K> extends Loadable(
  CancelableTokens(Reactionable(EmptyClass))
) {
  @observable
  nextString?: string | null = null;

  @observable
  data: T[] = [];

  @observable
  filters: {
    key: K;
    operation: FilteringOperations;
    value: string | boolean | any[];
  }[] = [];

  @observable
  sorts: { key: K; direction: SortingDirections }[] = [];

  private httpClient = Http.http;
  protected pageSize = 20;
  protected artificialDelayMs = 500;

  protected constructor(
    cancelTokensName: string,
    initialData?: T[],
    initialNextString?: NextString
  ) {
    super();
    makeObservable(this);
    this._cancelable_tokens_construct(cancelTokensName);
    if (initialData) {
      this.data = initialData;
    }
    if (initialNextString) {
      this.nextString = initialNextString;
    }
  }

  init() {
    this.react(
      () => {
        return [this.getQueryConfig()];
      },
      debounce(() => {
        return this.tapWithLoading(async () => {
          await sleep(this.artificialDelayMs);
          return this.fresh();
        });
      }, 500)
    );
  }

  protected getQueryConfig() {
    if (isDev()) {
      console.log("debug:: --------------");
      console.log(
        "debug:: SEARCHABLEDATAPROVIDER QUERYING",
        JSON.stringify(this.safeFilters, null, 2)
      );
      console.log("debug:: FILTERS", JSON.stringify(this.safeFilters, null, 2));
      console.log("debug:: SORTS", JSON.stringify(this.safeSorts, null, 2));
      console.log("debug:: --------------");
    }
    return {
      params: {
        count: this.pageSize,
        offset: 0,
        filters: this.safeFilters,
        sorts: this.safeSorts,
      },
      cancelToken: this.generate(
        `${jsonify(this.safeFilters)}-${jsonify(this.safeSorts)}`
      ),
    };
  }

  @computed
  private get safeFilters() {
    const filters = this.filters.filter((filter) => {
      return filter.value !== "";
    });
    return [...filters, ...this.getDefaultFilters()];
  }

  @computed
  private get safeSorts() {
    const sorts = this.sorts.filter((sort) => {
      return sort.direction !== "";
    });
    return [...sorts, ...this.getDefaultSorts()];
  }

  protected abstract query(): Promise<{ data: T[]; next?: string | null }>;

  public fresh() {
    return this.query().then((res) => {
      this.data = res.data;
      this.nextString = res.next;
      return res;
    });
  }

  public next() {
    if (!this.nextString) {
      return;
    }
    return this.httpClient.get(this.nextString).then((res) => {
      this.data = arrayMerge(this.data, res.data.data);
      this.nextString = res.data.next;
      return res;
    });
  }

  @computed
  get dataLength() {
    return this.data.length;
  }

  @computed
  get hasData() {
    return this.dataLength > 0;
  }

  @computed
  get hasMore() {
    return !!this.nextString;
  }

  protected abstract getDefaultFilters(): any[];

  protected abstract getDefaultSorts(): any[];

  get isFiltersEmpty() {
    return this.filters.length === 0;
  }

  get isSortsEmpty() {
    return this.sorts.length === 0;
  }

  resetFilters() {
    this.filters = [];
  }

  resetSorts() {
    this.sorts = [];
  }

  protected getHasFilterByKey(key: K) {
    return this.filters.findIndex((filter) => filter.key === key) !== -1;
  }

  protected getFilterByKey(key: K) {
    return this.filters.filter((filter) => filter.key === key)[0];
  }

  protected getFilterIndexByKey(key: K) {
    return this.filters.findIndex((filter) => filter.key === key);
  }

  protected removeFilterByKey(key: K) {
    this.filters = this.filters.filter((filter) => filter.key !== key);
  }
}

export default SearchableDataProvider;
