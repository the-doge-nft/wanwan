import { makeObservable, observable } from "mobx";
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
    this.comments = data;
  }

  async onCommentSubmit(body: string) {
    return AppStore.auth.runOrAuthPrompt(async () => {
      await http.post(`/meme/${this.id}/comment`, { body });
      this.getComments();
    });
  }

  async onParentCommentSubmit(body: string, parentCommentId: number) {
    return AppStore.auth.runOrAuthPrompt(async () => {
      await http.post(`/meme/${this.id}/comment`, { parentCommentId, body });
      this.getComments();
    });
  }
}
