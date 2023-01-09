import { makeObservable, observable } from "mobx";
import { Comment } from "../interfaces";
import http from "../services/http";

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

  async onCommentSubmit({
    parentCommentId,
    body,
  }: {
    parentCommentId: number;
    body: string;
  }) {
    await http.post(`/meme/${this.id}/comment`, { body });
    this.getComments();
  }
}
