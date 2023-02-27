import { add } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { action, computed, makeObservable, observable } from "mobx";
import { dateToDateTimeLocalInput } from "../components/DSL/Form/DateInput";
import { SelectItem } from "../components/DSL/Select/Select";
import { getTimezone } from "../helpers/dates";
import { formatEthereumAddress } from "../helpers/strings";
import { RewardBody, TokenType } from "../interfaces";
import Http from "../services/http";
import { Navigable } from "../services/mixins/navigable";
import { EmptyClass } from "./../services/mixins/index";

export enum CreateCompetitionView {
  Create = "Create",
  Success = "Success",
}

export default class CreateCompetitionStore extends Navigable(EmptyClass) {
  CREATOR_INPUT_PREFIX = "creator-input";
  REWARDS_INPUT_PREFIX = "rewards-input";
  REWARDS_INPUT_TYPE_PREFIX = "rewards-type-input";
  REWARDS_INPUT_ADDRESS_PREFIX = "rewards-address-input";
  REWARDS_INPUT_NUMBER_PREFIX = "rewards-number-input";
  REWARDS_INPUT_TOKENID_PREFIX = "rewards-tokenid-input";

  minEndsAtDate = dateToDateTimeLocalInput(add(new Date(), { minutes: 1 }));
  maxEndsAtDate = dateToDateTimeLocalInput(add(new Date(), { years: 1 }));
  defaultEndsAtDate = dateToDateTimeLocalInput(add(new Date(), { days: 1 }));

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
    console.log(values);
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
      }
    }
    body.name = values.name.trim();
    body.description =
      values.description !== "" ? values.description.trim() : null;

    body.endsAt = zonedTimeToUtc(values.endsAt, getTimezone());

    body.maxUserSubmissions = parseInt(values.maxUserSubmissions);
    body.curators = curators;

    const rewards = this.getRewardItems(values);
    body.rewards = rewards;
    console.log(body.rewards);
    return Http.postCompetition(body)
      .then(() => {
        this.isLoading = false;
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
        return "New Competition";
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

  private getRewardItems(formBody: {
    [key: string]: string | number;
  }): RewardBody[] {
    const rewards: RewardBody[] = [];
    for (let i = 0; i < this._rewardsCount; i++) {
      const typeKey = this.getInputKey("type", i);
      const amountKey = this.getInputKey("amount", i);
      const addressKey = this.getInputKey("address", i);
      const tokenIdKey = this.getInputKey("token-id", i);
      const type = formBody[typeKey] as TokenType;
      const amount = formBody[amountKey] as string;
      const contractAddress = formBody[addressKey] as string;
      const tokenId = formBody[tokenIdKey] as string;
      rewards.push({
        competitionRank: i + 1,
        // @next
        // currencyTokenAmount: amount,
        // currencyTokenId: tokenId,
        currency: { type, contractAddress, tokenId, amount },
      });
    }
    return rewards;
  }
}
