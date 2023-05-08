import { JSONContent } from "@tiptap/react";
import { add } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { computed, makeObservable, observable } from "mobx";
import Router from "next/router";
import { dateToDateTimeLocalInput } from "../../components/DSL/Form/DateInput";
import { getTimezone } from "../../helpers/dates";
import { Competition, Nullable, Wallet } from "../../interfaces/index";
import Http from "../../services/http";
import { Constructor, EmptyClass } from "../../services/mixins/index";
import { Navigable } from "../../services/mixins/navigable";
import TipTapEditorToolbarStore from "../TipTapEditorToolbar.store";
import CreateCompetitionCuratorsStore from "./CreateCompetitionCurators.store";
import CreateCompetitionRewardsStore from "./CreateCompetitionRewards.store";
import CreateCompetitionVoteStore from "./CreateCompetitionVoters.store";

export enum CreateCompetitionView {
  Name = "Name",
  Description = "Description",
  Details = "Details",
  Voters = "Voters",
  Curators = "Curators",
  Rewards = "Rewards",
  Review = "Review",
  Success = "Success",
}

export default class CreateCompetitionStore extends Navigable<
  Constructor,
  CreateCompetitionView
>(EmptyClass) {
  minEndsAtDate = dateToDateTimeLocalInput(add(new Date(), { minutes: 1 }));
  maxEndsAtDate = dateToDateTimeLocalInput(add(new Date(), { years: 1 }));
  defaultEndsAtDate = dateToDateTimeLocalInput(add(new Date(), { days: 1 }));

  @observable
  competitionReceipt?: Competition = undefined;

  @observable
  name = "";

  @observable
  wallet: Nullable<Wallet> = null;

  @observable
  description: Nullable<JSONContent> = null;

  @observable
  isLoading = false;

  @observable
  endsAt: string = this.defaultEndsAtDate;

  @observable
  maxUserSubmissions = "1";

  @observable
  votersStore = new CreateCompetitionVoteStore();

  @observable
  curatorStore = new CreateCompetitionCuratorsStore();

  @observable
  rewardStore = new CreateCompetitionRewardsStore();

  @observable
  coverImageFile?: File = undefined;

  @observable
  toolbarStore = new TipTapEditorToolbarStore();

  constructor() {
    super();
    makeObservable(this);
    this.currentView = CreateCompetitionView.Name;
  }

  init() {
    return Http.getWallet().then(({ data }) => (this.wallet = data));
  }

  destroy() {
    this.curatorStore.destroy();
  }

  async onCompetitionSubmit() {
    const body: { [key: string]: any } = {};
    this.isLoading = true;
    body.name = this.name.trim();
    body.endsAt = zonedTimeToUtc(this.endsAt, getTimezone());
    body.maxUserSubmissions = Number(this.maxUserSubmissions);
    if (this.description) {
      body.description = JSON.stringify(this.description);
    }

    body.curators = [];
    this.curatorStore.curators.forEach((store) =>
      body.curators.push(store.address)
    );

    body.voters = [];
    this.votersStore.votingRule.forEach((store) => {
      body.voters.push({
        type: store.tokenType,
        contractAddress: store.contractAddress,
      });
    });

    body.rewards = [];
    this.rewardStore.rewards.forEach((store, index) => {
      body.rewards.push({
        competitionRank: index + 1,
        currency: {
          type: store.tokenType,
          contractAddress: store.contractAddress,
          tokenId: store.tokenId,
          amount: store.amount,
        },
      });
    });
    const { data: compReceipt } = await Http.postCompetition(body);
    this.competitionReceipt = compReceipt;
    if (this.coverImageFile) {
      const { data: compReceiptWithCover } =
        await Http.updateCompetitionCoverPhoto(
          compReceipt.id,
          this.coverImageFile
        );
      this.competitionReceipt = compReceiptWithCover;
    }
    this.isLoading = false;
    Router.push(`/competition/${this.competitionReceipt.id}`);
  }

  @computed
  get title() {
    switch (this.currentView) {
      case CreateCompetitionView.Name:
        return "Name it";
      case CreateCompetitionView.Description:
        return "Describe it";
      case CreateCompetitionView.Details:
        return "Detail it";
      case CreateCompetitionView.Voters:
        return "Vote it";
      case CreateCompetitionView.Curators:
        return "Curate it";
      case CreateCompetitionView.Rewards:
        return "Reward it";
      case CreateCompetitionView.Success:
        return "You did it";
      default:
        return "";
    }
  }

  onNameSubmit({ name }: { name: string }) {
    this.currentView = CreateCompetitionView.Description;
  }

  onDescriptionSubmit() {
    this.currentView = CreateCompetitionView.Details;
  }

  onDetailsSubmit() {
    this.currentView = CreateCompetitionView.Voters;
  }

  onCuratorsSubmit() {
    this.currentView = CreateCompetitionView.Rewards;
  }

  onVotersSubmit() {
    this.currentView = CreateCompetitionView.Curators;
  }

  onRewardsSubmit() {
    this.currentView = CreateCompetitionView.Review;
  }

  onFileAccepted(file: File) {}

  onCoverFileAccepted(file: File) {
    this.coverImageFile = file;
  }

  onCoverFileClear() {
    this.coverImageFile = undefined;
  }

  @computed
  get hasVoters() {
    return this.votersStore.votingRule.length > 0;
  }

  @computed
  get hasCurators() {
    return this.curatorStore.curators.length > 0;
  }

  @computed
  get hasRewards() {
    return this.rewardStore.rewards.length > 0;
  }
}
