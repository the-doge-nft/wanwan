import { observable } from "mobx";
import { Competition, Meme } from "../interfaces";

export default class CompetitionByIdStore {
  @observable
  competition: Competition | null = null;

  @observable
  memes: Meme[] = [];

  constructor(
    private readonly id: string,
    competition: Competition | null,
    memes: Meme[]
  ) {
    this.competition = competition;
    this.memes = memes;
  }

  init() {
    // AppStore.events.subscribe(
    //   AppStore.events.events.LOGIN,
    //   this,
    //   "getUserEligibleMemes"
    // );
  }
}
