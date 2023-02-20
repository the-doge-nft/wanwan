import { ethers } from "ethers";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import {
  Address,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { css } from "../../helpers/css";
import { getEtherscanURL, jsonify } from "../../helpers/strings";
import { Reward, TokenType } from "../../interfaces";
import erc1155Abi from "../../services/abis/erc1155";
import erc20Abi from "../../services/abis/erc20";
import erc721Abi from "../../services/abis/erc721";
import AppStore from "../../store/App.store";
import RewardStore from "../../store/Reward.store";
import Button from "../DSL/Button/Button";
import Code from "../DSL/Code/Code";
import Link from "../DSL/Link/Link";
import Text, { TextSize, TextType } from "../DSL/Text/Text";

const RewardItem: React.FC<{
  reward: Reward;
  canDistribute: boolean;
  isActive: boolean;
  toAddress?: string;
  onSuccess: () => void;
  competitionId: number;
}> = observer(
  ({
    reward,
    canDistribute,
    isActive,
    toAddress,
    onSuccess,
    competitionId,
  }) => {
    const rewardStore = useMemo(() => new RewardStore(reward), [reward]);
    return (
      <div className={css("flex", "gap-2", "items-center")}>
        <div className={css("flex", "items-center", "gap-4")}>
          <Link
            href={getEtherscanURL(reward.currency.contractAddress, "token")}
            isExternal
          />
          <Text size={TextSize.sm}>{reward.competitionRank}</Text>
          <Text size={TextSize.sm}>
            {reward.currency.name ? reward.currency.name : "no name found"} (
            {ethers.utils.formatUnits(
              reward.currencyAmountAtoms,
              reward.currency.decimals
            )}
            )
          </Text>
        </div>
        <div className={css("grow")}></div>

        <div>
          {!isActive && !rewardStore.hasTxId && (
            <>
              {canDistribute && toAddress && (
                <DistributeReward
                  reward={reward}
                  toAddress={toAddress}
                  onSuccess={(txId: string) => {
                    rewardStore
                      .updateReward({ txId, competitionId })
                      .then(() => onSuccess());
                  }}
                />
              )}
              {!canDistribute && (
                <Text size={TextSize.xs} type={TextType.Grey}>
                  waiting on distribution
                </Text>
              )}
            </>
          )}
          {rewardStore.hasTxId && <Text size={TextSize.xs}>{reward.txId}</Text>}
          <div className={css("break-words")}>
            <Code>{jsonify(reward)}</Code>
          </div>
        </div>
      </div>
    );
  }
);

const DistributeReward = observer(
  ({
    reward,
    toAddress,
    onSuccess,
  }: {
    reward: Reward;
    toAddress: string;
    onSuccess: (txId: string) => void;
  }) => {
    const tokenTypeToContract = {
      [TokenType.ERC1155]: {
        abi: erc1155Abi,
        method: "safeTransferFrom",
        args: [
          AppStore.auth.address,
          toAddress,
          reward.currencyTokenId,
          Number(
            ethers.utils.formatUnits(
              reward.currencyAmountAtoms,
              reward.currency.decimals
            )
          ),
          [],
        ],
      },
      [TokenType.ERC721]: {
        abi: erc721Abi,
        method: "transferFrom",
        args: [AppStore.auth.address, toAddress, reward.currencyTokenId],
      },
      [TokenType.ERC20]: {
        abi: erc20Abi,
        method: "safeTransferFrom",
        args: [],
      },
    };

    const contractInfo = tokenTypeToContract[reward.currency.type];
    const { config, error } = usePrepareContractWrite({
      address: reward.currency.contractAddress as Address,
      abi: contractInfo.abi,
      functionName: contractInfo.method,
      args: contractInfo.args,
    });
    const { write, data, isLoading: isSigning } = useContractWrite(config);
    const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
      onSuccess: (params) => {
        onSuccess(params.transactionHash);
      },
    });
    return (
      <div>
        {!reward.txId && (
          <div>
            {error && jsonify(error)}{" "}
            {!error && (
              <Button
                onClick={() => write && write()}
                isLoading={isLoading || isSigning}
              >
                Distribute
              </Button>
            )}
          </div>
        )}
        {reward.txId && <div>{reward.txId}</div>}
      </div>
    );
  }
);

export default RewardItem;
