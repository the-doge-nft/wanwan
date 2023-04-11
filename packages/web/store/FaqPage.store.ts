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
      content:
        "Wanwan is a platform for meme competitions on Ethereum. Competition creators can define their own rules for the competition, which users can curate the competition (hide NSFW or offensive content), what rewards are available for 1st place, 2nd place, etc.",
    },
    {
      title: "How much of this is on chain?",
      content:
        "Currently only distributing rewards is on-chain. We currently are focused on keeping things as free and open as possible. If you have any ideas on how to move voting or competitions on chain without forcing users to pay gas please contact us!",
    },
  ];

  constructor() {
    makeObservable(this);
  }
}
