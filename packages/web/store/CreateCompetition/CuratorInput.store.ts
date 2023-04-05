import { makeObservable, observable } from "mobx";
import { getIsEnsFormat } from "../../components/DSL/Form/validation";
import { isValidEthereumAddress } from "../../helpers/strings";
import { Nullable } from "../../interfaces";
import Http from "../../services/http";
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
      //@ts-ignore
      (newSearch: string, oldSearch: string) => {
        if (newSearch !== oldSearch) {
          if (getIsEnsFormat(newSearch)) {
            this.isLoading = true;
            Http.postEnsForAddress(newSearch)
              .then(({ data }) => {
                this.address = data;
                this.ens = null;
              })
              .finally(() => {
                this.isLoading = false;
              });
          } else if (isValidEthereumAddress(newSearch)) {
            this.isLoading = true;
            Http.postAddressForEns(newSearch)
              .then(({ data }) => {
                this.ens = data;
                this.address = null;
              })
              .finally(() => {
                this.isLoading = false;
              });
          } else {
            this.address = null;
            this.ens = null;
          }
        }
        console.log(newSearch, oldSearch);
      }
    );
  }

  destroy() {
    return this.disposeReactions();
  }
}
