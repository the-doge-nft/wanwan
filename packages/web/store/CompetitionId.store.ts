import { action, computed, makeObservable, observable } from "mobx";
import { fuzzyDeepSearch } from "../helpers/arrays";
import { Competition, Meme } from "../interfaces";
import http from "../services/http";
import { Reactionable } from "../services/mixins/reactionable";
import { EmptyClass } from "./../services/mixins/index";
import AppStore from "./App.store";

export default class CompetitionByIdStore extends Reactionable(EmptyClass) {
  @observable
  competition: Competition;

  @observable
  memes: Meme[] = [];

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
  userSubmittedMemes: Meme[] = [];

  constructor(
    private readonly id: number,
    competition: Competition,
    memes: Meme[]
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
      .get<Meme[]>(`/competition/${this.id}/meme/submissions`)
      .then(({ data }) => (this.userSubmittedMemes = data));
  }

  @action
  onSearchChange = (value: string) => {
    this.searchValue = value;
  };

  @computed
  get filteredMemes() {
    const nonSelectedMemes = AppStore.auth.memes.filter(
      (meme) =>
        !this.selectedMemeIds.includes(meme.id) &&
        !this.userSubmittedMemes.map((meme) => meme.id).includes(meme.id)
    );
    if (this.searchValue === "") {
      return nonSelectedMemes;
    } else {
      return fuzzyDeepSearch(nonSelectedMemes, "name", this.searchValue);
    }
  }

  destroy() {
    this.disposeReactions();
  }

  @computed
  get showSubmitPane() {
    return AppStore.auth.isAuthed && this.canUserSelectMemes;
  }

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

  onSubmit() {
    this.isSubmitLoading = true;
    const promises = this.selectedMemeIds.map((memeId) =>
      http.post("/submission", { memeId, competitionId: this.id })
    );
    return Promise.all(promises).finally(() => (this.isSubmitLoading = false));
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
}
