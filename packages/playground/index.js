require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");

console.log(process.env.TWITTER_CONSUMER_KEY);
console.log(process.env.TWITTER_CONSUMER_SECRET);
console.log(process.env.TWITTER_ACCESS_TOKEN);
console.log(process.env.TWITTER_ACCESS_TOKEN_SECRET);

const main = async () => {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });
  const {
    data: { id },
  } = await client.currentUserV2();
  console.log("user id", id);

  const userTweets = await (
    await client.v2.userTimeline(id, {})
  ).fetchLast(1000);
  for (const tweet of userTweets) {
    const { id } = tweet;
    const deleted = await client.v2.deleteTweet(id);
    await sleep(500);
    console.log(tweet, deleted);
  }
};

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
