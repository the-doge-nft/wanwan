import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { jsonify } from "../../helpers/strings";
import { Reward } from "../../interfaces";
import { newHttp } from "../../services/http";
import RewardStore from "../../store/Reward.store";
import Button from "../DSL/Button/Button";

const CompetitionDistributeReward: React.FC<{
  reward: Reward;
  toAddress: string;
  onSuccess: () => void;
}> = observer(({ reward, toAddress, onSuccess }) => {
  const store = useMemo(
    () => new RewardStore(reward, toAddress),
    [reward, toAddress]
  );
  const { config, error } = usePrepareContractWrite(store.contractWriteConfig);
  const { write, data, isLoading: isSigning } = useContractWrite(config);
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (params) => {
      newHttp
        .updateReward({
          txId: params.transactionHash,
          rewardId: reward.id,
        })
        .then(() => onSuccess());
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
});

export default CompetitionDistributeReward;
