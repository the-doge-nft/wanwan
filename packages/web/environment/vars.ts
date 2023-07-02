import { objectKeys } from "../helpers/arrays";

enum AppEnv {
  Production = "PRODUCTION",
  Staging = "STAGING",
  Development = "DEVELOPMENT",
}

type NodeEnv = "production" | "development";

interface Vars {
  NodeEnv: NodeEnv;
  AppEnv: AppEnv;
  AlchemyKey: string;
  BuildHash: string;
  WalletConnectId: string;
}

export const vars: Vars = {
  NodeEnv: process.env.NODE_ENV as NodeEnv,
  AppEnv: process.env.NEXT_PUBLIC_APP_ENV as AppEnv,
  AlchemyKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string,
  BuildHash: process.env.NEXT_PUBLIC_SHA as string,
  WalletConnectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string,
};

const assertVars = () => {
  const publicKeys = objectKeys(vars).filter((key) => {
    const t = key as string;
    return t.includes("NEXT_PUBLIC");
  });
  const privateKeys = objectKeys(vars).filter((key) => {
    return !publicKeys.includes(key);
  });

  let keysToValidate = publicKeys;
  if (typeof window === "undefined") {
    keysToValidate = privateKeys;
  }

  keysToValidate.forEach((key) => {
    if (vars[key] === undefined) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  });
};
assertVars();

export const isProd = () =>
  vars.NodeEnv === "production" && vars.AppEnv === AppEnv.Production;

export const isStaging = () =>
  vars.NodeEnv === "production" && vars.AppEnv === AppEnv.Staging;

export const isDev = () => vars.NodeEnv === "development";

export const getBaseUrl = () => {
  let url = `https://wanwan.me`;
  if (isDev()) {
    url = `http://localhost:3001`;
  } else if (isStaging()) {
    url = `https://test.wanwan.me`;
  }
  return url;
};

export const TITLE = "wanwan";
export const DESCRIPTION = "Run competitions, create memes, win prizes";
export const TWITTER_USERNAME = "@wawandotme";
export const SOCIAL_CARD_URL = `${getBaseUrl()}/images/twitter-card.png`;
