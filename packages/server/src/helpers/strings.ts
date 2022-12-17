import { ethers } from 'ethers';

export const isValidEthereumAddress = (address: string) => {
  try {
    ethers.utils.getAddress(address);
    return true;
  } catch {
    return false;
  }
};
