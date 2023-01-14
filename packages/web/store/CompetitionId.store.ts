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
  canUserSubmit = false;

  @observable
  selectedMemeIds: number[] = [];

  @observable
  showSubmitContent = true;

  constructor(
    private readonly id: string,
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
          this.getCanUserSubmit();
        }
      },
      { fireImmediately: true }
    );
  }

  @action
  getCanUserSubmit() {
    return http
      .get(`/competition/${this.id}/canSubmit`)
      .then(({ data: canSubmit }) => (this.canUserSubmit = canSubmit));
  }

  @action
  onSearchChange = (value: string) => {
    this.searchValue = value;
  };

  @computed
  get filteredMemes() {
    const nonSelectedMemes = AppStore.auth.memes.filter(
      (meme) => !this.selectedMemeIds.includes(meme.id)
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
    return AppStore.auth.isAuthed && this.canUserSubmit;
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
}
