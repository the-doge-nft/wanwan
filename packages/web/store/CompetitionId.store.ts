import { action, computed, makeObservable, observable, toJS } from "mobx";
import { fuzzyDeepSearch } from "../helpers/arrays";
import { Competition, CompetitionMeme, Reward } from "../interfaces";
import { Reactionable } from "../services/mixins/reactionable";
import { TokenType } from "./../interfaces/index";
import Http from "./../services/http";
import { EmptyClass } from "./../services/mixins/index";
import AppStore from "./App.store";

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
  showSubmitContent = true;

  @observable
  showUserEntriesContent = true;

  @observable
  showRewards = true;

  @observable
  showDetails = true;

  @observable
  isSubmitLoading = false;

  @observable
  isCurateModalOpen = false;

  @observable
  showTitle = true;

  @observable
  showVoters = true;

  @observable
  private _memeIdToCurate?: number;

  @observable
  userSubmittedMemes: CompetitionMeme[] = [];

  constructor(competition: Competition, memes: CompetitionMeme[]) {
    super();
    makeObservable(this);
    this.competition = competition;
    this._rewards = competition.rewards;
    this.memes = memes;
  }

  init() {
    this.react(
      () => AppStore.auth.isAuthed,
      (isAuthed) => {
        if (isAuthed) {
          this.getUserSubmittedMemes();
        }
      },
      { fireImmediately: true }
    );
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
  toggleShowSubmitContent() {
    this.showSubmitContent = !this.showSubmitContent;
  }

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
    return [TokenType.ERC1155, TokenType.ERC721].includes(reward.currency.type);
  }

  runThenRefreshMemes(runIt: () => Promise<any>) {
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
}
