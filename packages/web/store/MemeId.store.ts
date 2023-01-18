import { computed, makeObservable, observable } from "mobx";
import { Comment } from "../interfaces";
import http from "../services/http";
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
    const { data } = await http.get<Comment[]>(`/meme/${this.id}/comment`);
    console.log(JSON.stringify(data, undefined, 2));
    this.comments = data;
  }

  // @next -- should get data as a tree instead
  getReply(parentId: number): Comment | Comment[] | undefined {
    const comments = this.comments.filter(
      (comment) => comment.parentCommentId === parentId
    );
    return comments;
  }

  async onCommentSubmit(body: string) {
    return AppStore.auth.runOrAuthPrompt(async () => {
      await http.post(`/meme/${this.id}/comment`, { body: body.trim() });
      this.getComments();
    });
  }

  async onParentCommentSubmit(body: string, parentCommentId: number) {
    return AppStore.auth.runOrAuthPrompt(async () => {
      await http.post(`/meme/${this.id}/comment`, {
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
