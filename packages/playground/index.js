require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");

const main = async () => {};

class TwitterClient {
  constructor() {
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
  }

  getUser() {
    return this.client.currentUserV2();
  }

  getUserTweets(userId) {
    return this.client.v2.userTimeline(userId, {});
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
