export interface FaqItem {
  id: string;
  title: string;
  content: string;
}

export default class FaqPageStore {
  items: FaqItem[] = [
    {
      id: "what",
      title: "What is wanwan?",
      content: "wanwan is a platform for p2p meme competitions on Ethereum.",
    },
    {
      id: "p2p",
      title: "What is a p2p meme competition?",
      content:
        "Our take on p2p in this context is a competition in which the community is able to vote on their favorite memes.",
    },
    {
      id: "whatineed",
      title: "What do I need to submit to a meme competition?",
      content: "An Ethereum wallet and your imagination.",
    },
    {
      id: "how",
      title: "How does it work?",
      content:
        "Anyone can create a competition, defining how many submissions users can make, how long the competition will run, who can vote, who can curate, and what rewards can be won. Once the competition has ended, it is the responsibility of the competition creator to distribute the rewards to the winners.",
    },
    {
      id: "",
      title: "How do competition creators distribute the rewards?",
      content:
        "We guide competition creators in our interface to send the correct rewards to the winners.",
    },
    {
      id: "rug",
      title:
        "What happens if competition creators don't distribute the rewards?",
      content:
        "Competition creators will not be able to create more competitions until they have distributed all rewards from previous competitions. Additionally they will receive a bad actor stamp on their profile if they do not distribute rewards within 7 days of the competition ending.",
    },
    {
      id: "winners",
      title: "How are winners of the competition determined?",
      content:
        "Voting is done Reddit-style with upvotes and downvotes. The memes with the top upvotes win prizes determined by the competition creator.",
    },
    {
      id: "multiplecomps",
      title: "Can I participate in multiple meme competitions?",
      content:
        "Yes, you can participate in as many competitions as you would like, and you may re-use any memes you have already created.",
    },
    {
      id: "ties",
      title:
        "What happens if there is a tie between two or more meme submissions?",
      content: "The meme submitted first will have priority.",
    },
    {
      id: "registration",
      title:
        "Is there a registration fee to participate in a meme competition?",
      content: "No.",
    },
    {
      id: "creatingmemes",
      title: "Are there any specific rules or guidelines for creating memes?",
      content:
        "Generally no, but check the description of the competition, the creator may be looking for something specific.",
    },
    {
      id: "on-chain",
      title: "How much of this is on-chain?",
      content:
        "Currently only distributing rewards is on-chain to functionality cheap but we are considering moving more on-chain in the future.",
    },
  ];
}
