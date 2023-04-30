import { Meme, NextString, SearchParams } from "../interfaces";
import Http from "../services/http";
import GridOrColumnScrollableStore from "./GridOrColumnScrollable.store";

class MemePageStore extends GridOrColumnScrollableStore<Meme> {
  localStorageKey = "meme-view";

  constructor(memes: Meme[], next: NextString, params: SearchParams) {
    super("memes-page", memes, next, params);
  }

  query() {
    return Http.searchMeme(this.getQueryConfig().params).then(
      ({ data }) => data
    );
  }
}

export default MemePageStore;
