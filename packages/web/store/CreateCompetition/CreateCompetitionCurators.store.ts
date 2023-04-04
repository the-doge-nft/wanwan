import { action, computed, makeObservable, observable } from "mobx";
import { isValidEthereumAddress } from "../../helpers/strings";
import { Nullable } from "../../interfaces";
import Http from "../../services/http";
import { EmptyClass } from "../../services/mixins";
import { Reactionable } from "../../services/mixins/reactionable";
import { getIsEnsFormat } from "./../../components/DSL/Form/validation";
export default class CreateCompetitionCuratorsStore extends Reactionable(
  EmptyClass
) {
  CURATOR_INPUT_PREFIX = "curator-input";
  private maxCount = 3;

  @observable
  private _count = 0;

  @observable
  curators: {
    [key: string]: {
      address: Nullable<string>;
      ens: Nullable<string>;
      search: string;
      isLoading: boolean;
    };
  } = {
    [this.getKey(0)]: {
      address: null,
      ens: null,
      search: "",
      isLoading: false,
    },
    [this.getKey(1)]: {
      address: null,
      ens: null,
      search: "",
      isLoading: false,
    },
    [this.getKey(2)]: {
      address: null,
      ens: null,
      search: "",
      isLoading: false,
    },
  };

  constructor() {
    super();
    makeObservable(this);
    this.react(
      () =>
        Object.keys(this.curators).map((key, index) => ({
          search: this.curators[key].search,
          index,
        })),
      (newValues, oldValues) => {
        newValues.forEach((item) => {
          //@ts-ignore
          if (item.search !== oldValues[item.index].search) {
            if (getIsEnsFormat(item.search)) {
              this.curators[this.getKey(item.index)].isLoading = true;
              Http.postEnsForAddress(item.search)
                .then(({ data }) => {
                  console.log("setting address");
                  this.curators[this.getKey(item.index)].address = data;
                })
                .finally(() => {
                  this.curators[this.getKey(item.index)].isLoading = false;
                });
            } else if (isValidEthereumAddress(item.search)) {
              this.curators[this.getKey(item.index)].isLoading = true;
              Http.postAddressForEns(item.search)
                .then(({ data }) => {
                  console.log("setting ens", data);
                  this.curators[this.getKey(item.index)].ens = data;
                })
                .finally(() => {
                  this.curators[this.getKey(item.index)].isLoading = false;
                });
            } else {
              this.curators[this.getKey(item.index)].address = null;
              this.curators[this.getKey(item.index)].ens = null;
            }
          }
        });
      }
    );
  }

  @action
  add() {
    this._count += 1;
  }

  @action
  remove() {
    this._count -= 1;
  }

  get isCuratorsVisible() {
    return this._count > 0;
  }

  @computed
  get count() {
    return this._count;
  }

  @computed
  get canRemove() {
    return this._count >= 1;
  }

  @computed
  get canAdd() {
    return this._count < this.maxCount;
  }

  getKey(index: number) {
    return `${this.CURATOR_INPUT_PREFIX}-${index}`;
  }
}
