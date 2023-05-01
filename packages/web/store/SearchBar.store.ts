import { action, computed, makeObservable, observable } from "mobx";
import { Search } from "../interfaces";
import Http from "../services/http";
import { EmptyClass } from "../services/mixins";
import { Loadable } from "../services/mixins/loadable";
import { Reactionable } from "../services/mixins/reactionable";

export default class SearchBarStore extends Reactionable(Loadable(EmptyClass)) {
  @observable
  data: Search = { memes: [], users: [], competitions: [] };

  @observable
  search = "";

  constructor() {
    super();
    makeObservable(this);
    this.react(
      () => this.search,
      (search) => {
        if (this.search !== "") {
          this.query(search);
        }
      }
    );
  }

  private query(search: string) {
    return this.tapWithLoading(() =>
      Http.postSearch(search).then(({ data }) => (this.data = data))
    );
  }

  @action
  setSearch(search: string) {
    this.search = search;
  }

  @computed
  get hasResults() {
    return this.hasMemes || this.hasUsers || this.hasCompetitions;
  }

  @computed
  get hasMemes() {
    return this.data.memes.length > 0;
  }

  @computed
  get hasUsers() {
    return this.data.users.length > 0;
  }

  @computed
  get hasCompetitions() {
    return this.data.competitions.length > 0;
  }

  @computed
  get showDropdown() {
    return this.search !== "";
  }
}
