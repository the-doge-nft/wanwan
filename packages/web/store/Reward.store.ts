import { ethers } from "ethers";
import { computed, makeObservable, observable } from "mobx";
import { Address } from "wagmi";
import { Reward, TokenType } from "../interfaces";
import erc1155Abi from "../services/abis/erc1155";
import erc20Abi from "../services/abis/erc20";
import erc721Abi from "../services/abis/erc721";
import { newHttp } from "./../services/http";
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
    console.log("debug:: reward", this.reward);
  }

  @computed
  private get tokenTypeToContract() {
    return {
      [TokenType.ERC1155]: {
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
      [TokenType.ERC721]: {
        abi: erc721Abi,
        method: "transferFrom",
        args: [
          AppStore.auth.address,
          this.toAddress,
          this.reward.currencyTokenId,
        ],
      },
      [TokenType.ERC20]: {
        abi: erc20Abi,
        method: "safeTransferFrom",
        args: [],
      },
    };
  }

  @computed
  get contractWriteConfig() {
    return {
      address: this.reward.currency.contractAddress as Address,
      abi: this.contractInfo.abi,
      functionName: this.contractInfo.method,
      args: this.contractInfo.args,
    };
  }

  @computed
  get contractInfo() {
    return this.tokenTypeToContract[this.reward.currency.type];
  }

  onSuccess(txId: string) {
    return this.updateReward({ txId });
  }

  private updateReward({ txId }: { txId: string }) {
    return newHttp.updateReward({
      txId,
      rewardId: this.reward.id,
    });
  }
}
