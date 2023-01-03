import devEnv from "./development";
import productionEnv from "./production";
import stagingEnv from "./staging";
import { isProduction, isStaging } from "./vars";

export interface Env {
  app: { name: string };
}

let env: Env = devEnv;
if (isStaging()) {
  env = stagingEnv;
} else if (isProduction()) {
  env = productionEnv;
}

export default env;
