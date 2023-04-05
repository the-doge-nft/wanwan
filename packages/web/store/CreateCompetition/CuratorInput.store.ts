import { makeObservable, observable } from "mobx";
import { Nullable } from "../../interfaces";
import { EmptyClass } from "../../services/mixins";
import { Reactionable } from "../../services/mixins/reactionable";

export default class CuratorInputStore extends Reactionable(EmptyClass) {
  @observable
  address: Nullable<string> = null;

  @observable
  ens: Nullable<string> = null;

  @observable
  search: string = "";

  @observable
  isLoading = false;

  constructor() {
    super();
    makeObservable(this);
    this.react(
      () => this.search,
      (newSearch, oldSearch) => {
        console.log(newSearch, oldSearch);
      }
    );
  }
}
