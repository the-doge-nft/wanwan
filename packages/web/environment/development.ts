import { Env } from ".";

// let proxyUrl = null;
let proxyUrl = "http://localhost:3000";

const env: Env = {
  app: { name: "wanwan" },
  api: { baseUrl: "https://api.test.wanwan.me" },
};

if (proxyUrl) {
  env.api.baseUrl = proxyUrl;
}

export default env;
