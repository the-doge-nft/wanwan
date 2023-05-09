import { JSONContent } from "@tiptap/react";
import { action, computed, makeObservable, observable } from "mobx";
import { Comment, Meme } from "../interfaces";
import Http from "./../services/http";
import AppStore from "./App.store";

export default class MemeIdStore {
  @observable
  comments: Comment[] = [];

  @observable
  meme: Meme;

  @observable
  likes: number = 0;

  @observable
  description?: JSONContent | string = undefined;

  @observable
  isDescriptionRichText = false;

  constructor(private readonly id: string, meme: Meme) {
    makeObservable(this);
    this.meme = meme;
    this.likes = this.meme.likes;
    if (this.meme.description) {
      try {
        const json = JSON.parse(this.meme.description as string);
        this.description = json;
        this.isDescriptionRichText = true;
      } catch (e) {
        this.description = this.meme.description;
        this.isDescriptionRichText = false;
      }
    }
  }

  async init() {
    this.getComments();
  }

  private async getComments() {
    const { data } = await Http.getComments(this.id);
    this.comments = data;
  }

  // @next -- should get data as a tree instead
  getReplies(parentId: number): Comment[] {
    const comments = this.comments.filter(
      (comment) => comment.parentCommentId === parentId
    );
    return comments;
  }

  async onCommentSubmit(body: string) {
    return AppStore.auth.runOrAuthPrompt(async () => {
      await Http.postComment({ memeId: this.id, body: body.trim() });
      this.getComments();
    });
  }

  async onParentCommentSubmit(body: string, parentCommentId: number) {
    return AppStore.auth.runOrAuthPrompt(async () => {
      await Http.postComment({
        memeId: this.id,
        parentCommentId,
        body: body.trim(),
      });
      this.getComments();
    });
  }

  @computed
  get canComment() {
    return AppStore.auth.isAuthed;
  }

  @action
  private getMeme() {
    return Http.getMeme(this.id).then(({ data }) => {
      this.meme = data;
      this.likes = this.meme.likes;
    });
  }

  @computed
  get isMemeLiked() {
    return AppStore.auth.memeIdsLiked.includes(this.meme.id);
  }

  toggleLike() {
    if (!AppStore.auth.isLoggedIn) {
      return;
    }
    if (this.isMemeLiked) {
      return Http.getUnlikeMeme(this.id).then(() =>
        Promise.all([this.getMeme(), AppStore.auth.getLikedMemeIds()])
      );
    } else {
      return Http.getLikeMeme(this.id).then(() =>
        Promise.all([this.getMeme(), AppStore.auth.getLikedMemeIds()])
      );
    }
  }
}
