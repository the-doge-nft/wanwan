import { ethers } from "ethers";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { css } from "../../helpers/css";
import { getEtherscanURL, jsonify } from "../../helpers/strings";
import { Reward } from "../../interfaces";
import RewardStore from "../../store/Reward.store";
import Button from "../DSL/Button/Button";
import Link from "../DSL/Link/Link";
import Text, { TextSize } from "../DSL/Text/Text";

const CompetitionDistributeReward: React.FC<{
  reward: Reward;
  toAddress: string;
  onSuccess: () => void;
}> = observer(({ reward, toAddress, onSuccess }) => {
  const store = useMemo(
    () => new RewardStore(reward, toAddress),
    [reward, toAddress]
  );
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
        <DistributeReward store={store} onSuccess={() => onSuccess()} />
      </div>
    </div>
  );
});

const DistributeReward = observer(
  ({ store, onSuccess }: { store: RewardStore; onSuccess: () => void }) => {
    const { config, error } = usePrepareContractWrite(
      store.contractWriteConfig
    );
    const { write, data, isLoading: isSigning } = useContractWrite(config);
    const { isLoading } = useWaitForTransaction({
      hash: data?.hash,
      onSuccess: (params) => {
        store.onSuccess(params.transactionHash).then(() => onSuccess());
      },
    });
    return (
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
    );
  }
);

export default CompetitionDistributeReward;
