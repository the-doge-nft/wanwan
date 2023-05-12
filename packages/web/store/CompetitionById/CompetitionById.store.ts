import { action, computed, makeObservable, observable, toJS } from "mobx";
import { fuzzyDeepSearch } from "../../helpers/arrays";
import {
  Competition,
  CompetitionMeme,
  CompetitionVoteReason,
  Meme,
  Reward,
} from "../../interfaces";
import { CurrencyType } from "../../interfaces/index";
import Http from "../../services/http";
import { EmptyClass } from "../../services/mixins/index";
import { Reactionable } from "../../services/mixins/reactionable";
import AppStore from "../App.store";
import CompetitionByIdPaneVisibilityStore from "./CompetitionByIdPaneVisibility.store";

export default class CompetitionByIdStore extends Reactionable(EmptyClass) {
  @observable
  competition: Competition;

  @observable
  memes: CompetitionMeme[] = [];

  @observable
  _rewards: Reward[] = [];

  @observable
  searchValue = "";

  @observable
  selectedMemeIds: number[] = [];

  @observable
  isSubmitLoading = false;

  @observable
  isCurateModalOpen = false;

  @observable
  private _memeIdToCurate?: number;

  @observable
  userSubmittedMemes: CompetitionMeme[] = [];

  @observable
  showPaneStore: CompetitionByIdPaneVisibilityStore;

  @observable
  private userVoteReason: Array<CompetitionVoteReason> = [];

  @observable
  isInvalidVoteRuleModalOpen = false;

  @observable
  isSubmitMemeModalOpen = false;

  constructor(competition: Competition, memes: CompetitionMeme[]) {
    super();
    makeObservable(this);
    this.competition = competition;
    this._rewards = competition.rewards;
    this.memes = memes;
    this.showPaneStore = new CompetitionByIdPaneVisibilityStore(competition.id);
  }

  init() {
    this.showPaneStore.init();
    this.react(
      () => AppStore.auth.isAuthed,
      (isAuthed) => {
        if (isAuthed) {
          this.getUserSubmittedMemes();
          this.getCanUserVoteReason();
        } else {
          this.isInvalidVoteRuleModalOpen = false;
          this.userVoteReason = [];
        }
      },
      { fireImmediately: true }
    );
  }

  getCanUserVoteReason() {
    return Http.getCanUserVoteReason(this.competition.id).then(({ data }) => {
      this.userVoteReason = data;
      return data;
    });
  }

  @action
  getUserSubmittedMemes() {
    return Http.getCompetitionMemeSubmissions(this.competition.id).then(
      ({ data }) =>
        (this.userSubmittedMemes = data.sort((a, b) => b.score - a.score))
    );
  }

  @action
  getRankedMemes() {
    return Http.getCompetitionMemes(this.competition.id).then(
      ({ data }) => (this.memes = data)
    );
  }

  @action
  onSearchChange = (value: string) => {
    this.searchValue = value;
  };

  @action
  onMemeSelect(id: number) {
    if (this.competition.maxUserSubmissions > this.selectedMemeIds.length) {
      this.selectedMemeIds.push(id);
    }
  }

  @action
  onMemeDeselect(id: number) {
    this.selectedMemeIds = this.selectedMemeIds.filter(
      (memeId) => memeId !== id
    );
  }

  destroy() {
    this.disposeReactions();
  }

  onSubmit() {
    this.isSubmitLoading = true;
    const promises = this.selectedMemeIds.map((memeId) =>
      Http.postSubmission({ memeId, competitionId: this.competition.id })
    );
    return Promise.all(promises)
      .then(() => {
        this.userSubmittedMemes.concat(
          toJS(
            this.selectedMemes.map((meme) => ({
              ...meme,
              comments: [],
              submissions: [],
              score: 0,
              votes: [],
            }))
          )
        );
        this.getUserSubmittedMemes().then(() => (this.selectedMemeIds = []));
        this.getRankedMemes();
      })
      .finally(() => (this.isSubmitLoading = false));
  }

  upVote(memeId: number) {
    return Http.postVote({
      competitionId: this.competition.id,
      memeId,
      score: 1,
    });
  }

  downVote(memeId: number) {
    return Http.postVote({
      competitionId: this.competition.id,
      memeId,
      score: -1,
    });
  }

  zeroVote(memeId: number) {
    return Http.postVote({
      competitionId: this.competition.id,
      memeId,
      score: 0,
    });
  }

  @action
  getCompetition() {
    return Http.getCompetition(this.competition.id).then(({ data }) => {
      this.competition = data;
      this._rewards = data.rewards;
    });
  }

  @computed
  get showSubmitPane() {
    return (
      AppStore.auth.isAuthed &&
      this.canUserSelectMemes &&
      this.competition.isActive &&
      !!AppStore.auth.user &&
      AppStore.auth?.user?.id !== this.competition.createdById
    );
  }

  @computed
  get showHasEntriesPane() {
    return AppStore.auth.isAuthed && this.userEntriesCount > 0;
  }

  @computed
  get selectedMemes() {
    return AppStore.auth.memes.filter((meme) =>
      this.selectedMemeIds.includes(meme.id)
    );
  }

  @computed
  get hasSelectedMemes() {
    return this.selectedMemes.length > 0;
  }

  @computed
  get availableMemes() {
    return AppStore.auth.memes.filter(
      (meme) =>
        !this.selectedMemeIds.includes(meme.id) &&
        !this.userSubmittedMemes.map((meme) => meme.id).includes(meme.id)
    );
  }

  @computed
  get filteredMemes() {
    if (this.searchValue === "") {
      return this.availableMemes;
    } else {
      return fuzzyDeepSearch(this.availableMemes, "name", this.searchValue);
    }
  }

  @computed
  get isMemesToSubmitMax() {
    return this.selectedMemes.length === this.countMemeUserCanSubmit;
  }

  @computed
  get countMemeUserCanSubmit() {
    return this.competition.maxUserSubmissions - this.userSubmittedMemes.length;
  }

  @computed
  get canUserSelectMemes() {
    return this.competition.maxUserSubmissions > this.userEntriesCount;
  }

  @computed
  get canSubmit() {
    return (
      this.selectedMemes.length > 0 &&
      this.competition.maxUserSubmissions >= this.userEntriesCount
    );
  }

  @computed
  get userEntriesCount() {
    return this.userSubmittedMemes.length;
  }

  @computed
  get totalVotes() {
    return this.memes.reduce(
      (acc, meme) =>
        acc +
        meme.votes.filter((vote) => vote.competitionId === this.competition.id)
          .length,
      0
    );
  }

  getMemePlaceInCompetition(id: number) {
    return this.memes.findIndex((meme) => meme.id === id) + 1;
  }

  @computed
  get rewards() {
    return [...this._rewards].sort(
      (a, b) => a.competitionRank - b.competitionRank
    );
  }

  @computed
  get isCreator() {
    return (
      AppStore.auth.isAuthed &&
      AppStore.auth.user?.id === this.competition.createdById
    );
  }

  getIsRewardNFT(id: number) {
    const reward = this.rewards.find((reward) => reward.id === id);
    if (!reward) {
      throw new Error("Could not find reward");
    }
    return [CurrencyType.ERC1155, CurrencyType.ERC721].includes(
      reward.currency.type
    );
  }

  runThenRefreshMemes(runIt: () => Promise<any | void>) {
    return runIt().then(() => this.getRankedMemes());
  }

  @computed
  get isUserCurator() {
    return (
      AppStore.auth?.user?.id &&
      this.competition.curators
        .map((user) => user.id)
        .includes(AppStore.auth.user.id)
    );
  }

  @computed
  get memeToCurate() {
    return this.memes.filter((meme) => meme.id === this._memeIdToCurate)[0];
  }

  @computed
  get isActive() {
    return this.competition.isActive;
  }

  @action
  setMemeToCurate(id: number) {
    this.isCurateModalOpen = true;
    this._memeIdToCurate = id;
  }

  hideSubmission() {
    return Http.postCurateCompetitionMeme({
      competitionId: this.competition.id,
      memeId: this._memeIdToCurate!,
    });
  }

  @computed
  get hasVoters() {
    return this.competition.votingRule.length > 0;
  }

  @computed
  get canUserVote() {
    return (
      AppStore.auth.isAuthed && this.userVoteReason.some((item) => item.canVote)
    );
  }

  @computed
  get invalidVoteReason() {
    return this.userVoteReason.filter((item) => !item.canVote);
  }

  runIfCanVote(callback: () => void) {
    if (this.canUserVote) {
      return callback();
    } else {
      this.isInvalidVoteRuleModalOpen = true;
    }
    return;
  }

  onMemesCreatedSuccess(memes: Array<Meme>) {
    console.log("debug:::: got memes yo", memes);
    memes.forEach((meme) => {
      this.selectedMemeIds.push(meme.id);
    });
    this.onSubmit().then(() => (this.isSubmitMemeModalOpen = false));
  }
}
