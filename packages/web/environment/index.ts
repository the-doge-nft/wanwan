import devEnv from "./development";
import productionEnv from "./production";
import stagingEnv from "./staging";
import { isProd, isStaging } from "./vars";

export interface Env {
  app: { name: string };
  api: { baseUrl: string };
}

let env: Env = devEnv;
if (isStaging()) {
  env = stagingEnv;
} else if (isProd()) {
  env = productionEnv;
}

export default env;
