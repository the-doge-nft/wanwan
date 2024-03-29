import { utils } from "ethers/lib/ethers";
import { isDev, isStaging } from "../environment/vars";

export const abbreviate = (input: string, spaces = 4) => {
  return `${input.substring(0, spaces)}...${input.substring(
    input.length - spaces,
    input.length
  )}`;
};

export const getEtherscanURL = (
  address: string,
  type: "tx" | "address" | "token"
) => {
  let link = `https://etherscan.io/${type}/${address}`;
  if (isDev() || isStaging()) {
    link = `https://goerli.etherscan.io/${type}/${address}`;
  }
  return link;
};

export const getRainobwURL = (addressOrEns: string) => {
  return `https://rainbow.me/${addressOrEns}`;
};

export const getOpenSeaURL = (address: string, tokenId: string | number) => {
  let link = `https://opensea.io/assets/ethereum/${address}/${tokenId}`;
  if (isDev() || isStaging()) {
    link = `https://testnets.opensea.io/assets/goerli/${address}/${tokenId}`;
  }
  return link;
};

export const getOpenSeaCollectionURL = (address: string) => {
  let link = `https://opensea.io/collection/${address}`;
  if (isDev() || isStaging()) {
    link = `https://testnets.opensea.io/collection/${address}`;
  }
  return link;
};

export const getLooksRareCollectionURL = (address: string) => {
  let link = `https://looksrare.org/collections/${address}`;
  if (isDev() || isStaging()) {
    link = `https://goerli.looksrare.org/collections/${address}`;
  }
  return link;
};

export const jsonify = (toString: any) => JSON.stringify(toString);

export const isValidHttpUrl = (value: string) => {
  let url;
  try {
    url = new URL(value);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

export const isValidEthereumAddress = (address: string) => {
  try {
    utils.getAddress(address);
    return true;
  } catch {
    return false;
  }
};

export const formatEthereumAddress = (address: string) =>
  utils.getAddress(address);

export function decodeBase64(value: string) {
  return JSON.parse(Buffer.from(value, "base64").toString());
}

export function encodeBase64(obj: object) {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
}

export function getBingReverseImageSearchURL(url: string) {
  return `https://www.bing.com/images/search?q=imgurl:${url}
                            &view=detailv2&selectedindex=0&iss=sbi&id=${url}&ccid=zUFO%2BkX6&mediaurl=${url}&exph=511&expw=498&vt=2&sim=11`;
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
