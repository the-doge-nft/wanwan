import { observable } from "mobx";
import { Competition, Meme } from "../interfaces";
import AppStore from "./App.store";

export default class CompetitionByIdStore {
  @observable
  competition: Competition | null = null;

  @observable
  memes: Meme[] | null;

  constructor(
    private readonly id: string,
    competition: Competition | null,
    memes: Meme[] | null
  ) {
    this.competition = competition;
    this.memes = memes;
  }

  getUserCompetitionMemes() {
    if (AppStore.auth.isAuthed) {
    }
  }

  init() {}
}
