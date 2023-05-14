import { computed, makeObservable } from "mobx";
import { Meme, NextString, SearchParams } from "../interfaces";
import Http from "../services/http";
import AppStore from "./App.store";
import GridOrColumnScrollableStore from "./GridOrColumnScrollable.store";

class MemePageStore extends GridOrColumnScrollableStore<Meme> {
  localStorageKey = "meme-view";

  constructor(memes: Meme[], next: NextString, params: SearchParams) {
    super("memes-page", memes, next, params);
    makeObservable(this);
  }

  query() {
    return Http.searchMeme(this.getQueryConfig().params).then(
      ({ data }) => data
    );
  }

  async toggleLike(memeId: number) {
    const isLiked = AppStore.auth.memeIdsLiked.includes(memeId);
    if (isLiked) {
      await Http.getUnlikeMeme(memeId);
    } else {
      await Http.getLikeMeme(memeId);
    }
    AppStore.auth.getLikedMemeIds();

    // update the likes in place to avoid refreshing all data causing a scroll jump
    const meme = this.data.find((meme) => meme.id === memeId)!;
    const index = this.data.indexOf(meme!);
    this.data.splice(index, 1, {
      ...meme,
      likes: meme.likes + (isLiked ? -1 : 1),
    });
  }

  getLikesForId(memeId: number) {
    const meme = this.data.find((meme) => meme.id === memeId);
    return meme?.likes || 0;
  }

  @computed
  get likedMemeIds() {
    return this.data
      .filter((meme) => meme.likes > 0)
      .map((meme) => ({ id: meme.id, likes: meme.likes }));
  }
}

export default MemePageStore;
