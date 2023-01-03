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
}

export const vars: Vars = {
  NodeEnv: process.env.NODE_ENV as NodeEnv,
  AppEnv: process.env.NEXT_PUBLIC_APP_ENV as AppEnv,
  AlchemyKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY as string,
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

export const isProduction = () =>
  vars.NodeEnv === "production" && vars.AppEnv === AppEnv.Production;

export const isStaging = () =>
  vars.NodeEnv === "production" && vars.AppEnv === AppEnv.Staging;

export const isDevelopment = () =>
  vars.NodeEnv === "development" && vars.AppEnv === AppEnv.Development;
