import { computed, makeObservable, observable } from "mobx";
import { Comment } from "../interfaces";
import { Http } from "./../services/http";
import AppStore from "./App.store";

export default class MemeIdStore {
  @observable
  comments: Comment[] = [];

  constructor(private readonly id: string) {
    makeObservable(this);
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
}
