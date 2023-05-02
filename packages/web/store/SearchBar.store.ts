import { action, computed, makeObservable, observable } from "mobx";
import sleep from "../helpers/sleep";
import { Search } from "../interfaces";
import Http from "../services/http";
import { EmptyClass } from "../services/mixins";
import { Loadable } from "../services/mixins/loadable";

export default class SearchBarStore extends Loadable(EmptyClass) {
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

  private query(search: string) {
    return this.tapWithLoading(() =>
      Http.postSearch(search).then(async ({ data }) => {
        await sleep(1000);
        this.data = data;
        return data;
      })
    );
  }

  @action
  setSearch(search: string) {
    this.search = search;
    if (this.search !== "") {
      this.showDropdown = true;
      this.query(search);
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
