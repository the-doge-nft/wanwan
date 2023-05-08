import { debounce } from "lodash";
import { action, computed, makeObservable, observable } from "mobx";
import { Search } from "../interfaces";
import Http from "../services/http";
import { EmptyClass } from "../services/mixins";
import { Abortable } from "../services/mixins/abortable";
import { Loadable } from "../services/mixins/loadable";

export default class SearchBarStore extends Loadable(Abortable(EmptyClass)) {
  @observable
  data: Search = { memes: [], profiles: [], competitions: [] };

  @observable
  search = "";

  @observable
  showDropdown = false;

  constructor() {
    super();
    makeObservable(this);
    this.isLoading = true;
  }

  private query() {
    this.abort();
    return this.tapWithLoading(() =>
      Http.postSearch(this.search, this.abortController.signal)
        .then(async ({ data }) => {
          this.data = data;
          return data;
        })
        .catch((e) => {})
    );
  }

  debouncedQuery = debounce(this.query, 500);

  @action
  setSearch(search: string) {
    this.search = search;
    if (this.search !== "") {
      if (!this.showDropdown) {
        this.showDropdown = true;
      }
      this.debouncedQuery();
    } else {
      this.showDropdown = false;
    }
  }

  @computed
  get hasResults() {
    return this.hasMemes || this.hasProfiles || this.hasCompetitions;
  }

  @computed
  get hasMemes() {
    return this.data.memes.length > 0;
  }

  @computed
  get hasProfiles() {
    return this.data.profiles.length > 0;
  }

  @computed
  get hasCompetitions() {
    return this.data.competitions.length > 0;
  }
}
