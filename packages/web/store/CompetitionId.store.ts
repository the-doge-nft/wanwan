import { action, computed, makeObservable, observable, toJS } from "mobx";
import { fuzzyDeepSearch } from "../helpers/arrays";
import { Competition, CompetitionMeme } from "../interfaces";
import http from "../services/http";
import { Reactionable } from "../services/mixins/reactionable";
import { EmptyClass } from "./../services/mixins/index";
import AppStore from "./App.store";

export default class CompetitionByIdStore extends Reactionable(EmptyClass) {
  @observable
  competition: Competition;

  @observable
  memes: CompetitionMeme[] = [];

  @observable
  searchValue = "";

  @observable
  selectedMemeIds: number[] = [];

  @observable
  showSubmitContent = true;

  @observable
  showUserEntriesContent = true;

  @observable
  isSubmitLoading = false;

  @observable
  userSubmittedMemes: CompetitionMeme[] = [];

  constructor(
    private readonly id: number,
    competition: Competition,
    memes: CompetitionMeme[]
  ) {
    super();
    makeObservable(this);
    this.competition = competition;
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
    return http
      .get<CompetitionMeme[]>(`/competition/${this.id}/meme/submissions`)
      .then(({ data }) => (this.userSubmittedMemes = data));
  }

  @action
  getRankedMemes() {
    return http
      .get<CompetitionMeme[]>(`/competition/${this.id}/meme/ranked`)
      .then(({ data }) => (this.memes = data));
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
      http.post("/submission", { memeId, competitionId: this.id })
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
    return http
      .post(`/competition/${this.id}/vote`, { score: 1, memeId })
      .then(() => this.getRankedMemes());
  }

  downVote(memeId: number) {
    return http
      .post(`/competition/${this.id}/vote`, { score: -1, memeId })
      .then(() => this.getRankedMemes());
  }

  zeroVote(memeId: number) {
    return http
      .post(`/competition/${this.id}/vote`, { score: 0, memeId })
      .then(() => this.getRankedMemes());
  }

  @computed
  get showSubmitPane() {
    return AppStore.auth.isAuthed && this.canUserSelectMemes;
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
    return this.memes.reduce((acc, meme) => acc + meme.votes.length, 0);
  }

  getMemePlaceInCompetition(id: number) {
    return this.memes.findIndex((meme) => meme.id === id) + 1;
  }
}
