import { ethers } from 'ethers';

export const isValidEthereumAddress = (address: string) => {
  try {
    ethers.utils.getAddress(address);
    return true;
  } catch {
    return false;
  }
};

export const formatEthereumAddress = (address: string) =>
  ethers.utils.getAddress(address);

export const abbreviate = (input: string, spaces = 4) => {
  return `${input.substring(0, spaces)}...${input.substring(
    input.length - spaces,
    input.length,
  )}`;
};
