import { ethers } from "ethers";
import { computed, makeObservable, observable } from "mobx";
import { Address } from "wagmi";
import { CurrencyType, Reward } from "../interfaces";
import erc1155Abi from "../services/abis/erc1155";
import erc20Abi from "../services/abis/erc20";
import erc721Abi from "../services/abis/erc721";
import Http from "./../services/http";
import AppStore from "./App.store";

export default class RewardStore {
  @observable
  reward: Reward;

  @observable
  toAddress: string;

  constructor(reward: Reward, toAddress: string) {
    makeObservable(this);
    this.reward = reward;
    this.toAddress = toAddress;
  }

  @computed
  private get tokenTypeToContract() {
    return {
      [CurrencyType.ERC1155]: {
        abi: erc1155Abi,
        method: "safeTransferFrom",
        args: [
          AppStore.auth.address,
          this.toAddress,
          this.reward.currencyTokenId,
          Number(
            ethers.utils.formatUnits(
              this.reward.currencyAmountAtoms,
              this.reward.currency.decimals
            )
          ),
          [],
        ],
      },
      [CurrencyType.ERC721]: {
        abi: erc721Abi,
        method: "transferFrom",
        args: [
          AppStore.auth.address,
          this.toAddress,
          this.reward.currencyTokenId,
        ],
      },
      [CurrencyType.ERC20]: {
        abi: erc20Abi,
        method: "transfer",
        args: [this.toAddress, this.reward.currencyAmountAtoms],
      },
    };
  }

  @computed
  get contractWriteConfig() {
    if (this.reward.currency.type === CurrencyType.ETH) {
      return null;
    }
    return {
      address: this.reward.currency.contractAddress as Address,
      abi: this.contractInfo!.abi,
      functionName: this.contractInfo!.method,
      args: this.contractInfo!.args,
    };
  }

  @computed
  get contractInfo() {
    if (this.reward.currency.type === CurrencyType.ETH) {
      return null;
    }
    return this.tokenTypeToContract[this.reward.currency.type];
  }

  onSuccess(txId: string) {
    return this.updateReward({ txId });
  }

  private updateReward({ txId }: { txId: string }) {
    return Http.updateReward({
      txId,
      rewardId: this.reward.id,
    });
  }

  @computed
  get tokenType() {
    return this.reward.currency.type;
  }
}
