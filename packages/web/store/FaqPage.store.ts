import { makeObservable, observable } from "mobx";

export interface FaqItem {
  title: string;
  content: string;
}

export default class FaqPageStore {
  @observable
  items: FaqItem[] = [
    {
      title: "What is wanwan?",
      content: "wanwan is a platform for p2p meme competitions on Ethereum.",
    },
    {
      title: "What is a p2p meme competition?",
      content:
        "Our take on p2p in this context is a competition in which the community is able to vote on their favorite memes.",
    },
    {
      title: "What do I need to submit to a meme competition?",
      content: "An Ethereum wallet and your imagination.",
    },
  ];

  constructor() {
    makeObservable(this);
  }
}
