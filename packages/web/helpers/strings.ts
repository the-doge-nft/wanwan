import { isDev, isStaging } from "../environment/vars";

export const abbreviate = (input: string, spaces = 4) => {
  return `${input.substring(0, spaces)}...${input.substring(
    input.length - spaces,
    input.length
  )}`;
};

export const getEtherscanURL = (address: string, type: "tx" | "address") => {
  let link = `https://etherscan.io/${type}/${address}`;
  if (isDev() || isStaging()) {
    link = `https://goerli.etherscan.io/${type}/${address}`;
  }
  return link;
};
