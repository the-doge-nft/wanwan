import { action, computed, makeObservable, observable } from "mobx";
import { SelectItem } from "../components/DSL/Select/Select";
import { formatEthereumAddress } from "../helpers/strings";
import http from "../services/http";
import { Navigable } from "../services/mixins/navigable";
import { EmptyClass } from "./../services/mixins/index";
import AppStore from "./App.store";

export enum CreateCompetitionView {
  Create = "Create",
  Success = "Success",
}

export enum TokenType {
  ERC1155 = "ERC1155",
  ERC721 = "ERC721",
  ERC20 = "ERC20",
}

export default class CreateCompetitionStore extends Navigable(EmptyClass) {
  CREATOR_INPUT_PREFIX = "creator-input";
  REWARDS_INPUT_PREFIX = "rewards-input";
  REWARDS_INPUT_TYPE_PREFIX = "rewards-type-input";
  REWARDS_INPUT_ADDRESS_PREFIX = "rewards-address-input";
  REWARDS_INPUT_NUMBER_PREFIX = "rewards-number-input";
  REWARDS_INPUT_TOKENID_PREFIX = "rewards-tokenid-input";

  @observable
  private _curatorsCount = 0;

  @observable
  private _rewardsCount = 0;

  @observable
  isLoading = false;

  @observable
  rewardInputTypes: { [key: string]: TokenType } = {};

  @observable
  rewardInputAmounts: { [key: string]: string } = {};

  constructor() {
    super();
    makeObservable(this);
    this.currentView = CreateCompetitionView.Create;
  }

  onCompetitionSubmit(values: any) {
    this.isLoading = true;
    const formValues = { ...values };
    const curators: string[] = [];
    const body: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(formValues)) {
      if (key.startsWith(this.CREATOR_INPUT_PREFIX)) {
        const formattedAddress = formatEthereumAddress(value as string);
        if (!curators.includes(formattedAddress)) {
          curators.push(formatEthereumAddress(value as string));
        }
      } else {
        body[key] = value;
      }
    }
    const rewards: string[] = [];
    body.curators = curators;
    body.rewards = rewards;
    body.maxUserSubmissions = parseInt(body.maxUserSubmissions);
    return http
      .post(`/competition`, body)
      .then(() => {
        this.isLoading = false;
        AppStore.events.publish(AppStore.events.events.COMPETITION_CREATED);
        this.currentView = CreateCompetitionView.Success;
      })
      .catch((e) => {
        this.isLoading = false;
        throw e;
      });
  }

  @computed
  get title() {
    switch (this.currentView) {
      case CreateCompetitionView.Create:
        return "Create Competition";
      case CreateCompetitionView.Success:
        return "Competition Created";
      default:
        return "";
    }
  }

  @action
  addCurator() {
    this._curatorsCount += 1;
  }

  @action
  removeCurator() {
    this._curatorsCount -= 1;
  }

  @action
  addReward() {
    this._rewardsCount += 1;
  }

  @action
  removeReward() {
    this._rewardsCount -= 1;
  }

  get isCuratorsVisible() {
    return this._curatorsCount > 0;
  }

  @computed
  get curatorCount() {
    return this._curatorsCount;
  }

  @computed
  get showRemoveCurator() {
    return this._curatorsCount >= 1;
  }

  get isRewardsVisible() {
    return this._rewardsCount > 0;
  }

  @computed
  get rewardsCount() {
    return this._rewardsCount;
  }

  @computed
  get showRemoveReward() {
    return this._rewardsCount >= 1;
  }

  @computed
  get canAddReward() {
    return this._rewardsCount < 3;
  }

  @computed
  get canAddCurator() {
    return this._curatorsCount < 3;
  }

  getShowTokenIdInput(key: string) {
    return this.rewardInputTypes?.[key] !== TokenType.ERC20;
  }

  getIsAmountDisabled(key: string) {
    return this.rewardInputTypes?.[key] === TokenType.ERC721;
  }

  getInputKey(type: "type" | "token-id" | "amount" | "address", index: number) {
    switch (type) {
      case "type":
        return `${this.REWARDS_INPUT_PREFIX}-${this.REWARDS_INPUT_TYPE_PREFIX}-${index}`;
      case "token-id":
        return `${this.REWARDS_INPUT_PREFIX}-${this.REWARDS_INPUT_TOKENID_PREFIX}-${index}`;
      case "amount":
        return `${this.REWARDS_INPUT_PREFIX}-${this.REWARDS_INPUT_NUMBER_PREFIX}-${index}`;
      case "address":
        return `${this.REWARDS_INPUT_PREFIX}-${this.REWARDS_INPUT_ADDRESS_PREFIX}-${index}`;
      default:
        throw new Error("Invalid type");
    }
  }

  @action
  onTypeInputChange(index: number, value: TokenType) {
    const typeKey = this.getInputKey("type", index);
    const amountKey = this.getInputKey("amount", index);
    const amountValue = this.rewardInputAmounts[amountKey];
    this.rewardInputTypes[typeKey] = value;
    if (value === TokenType.ERC721) {
      if (!amountValue || amountValue !== "1") {
        this.rewardInputAmounts[amountKey] = "1";
      }
    } else {
      this.rewardInputAmounts[amountKey] = "";
    }
  }

  @action
  onAmountInputChange(typeKey: string, value: string) {
    this.rewardInputAmounts[typeKey] = value;
  }

  get rewardsTypeSelectItems(): SelectItem[] {
    return [
      { name: TokenType.ERC1155, id: TokenType.ERC1155 },
      { name: TokenType.ERC721, id: TokenType.ERC721 },
      { name: TokenType.ERC20, id: TokenType.ERC20 },
    ];
  }
}
