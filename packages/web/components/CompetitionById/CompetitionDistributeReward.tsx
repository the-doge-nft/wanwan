import { BigNumber } from "ethers";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { jsonify } from "../../helpers/strings";
import { Reward, TokenType } from "../../interfaces";
import Http from "../../services/http";
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

  if (store.tokenType === TokenType.ETH) {
    return <DistributeEthReward store={store} onSuccess={() => onSuccess()} />;
  }

  return <DistributeNonEthReward store={store} onSuccess={() => onSuccess()} />;
});

interface DistributeRewardProps {
  store: RewardStore;
  onSuccess: () => void;
}

const DistributeEthReward = ({ store, onSuccess }: DistributeRewardProps) => {
  const { config } = usePrepareSendTransaction({
    request: {
      to: store.toAddress,
      value: BigNumber.from(store.reward.currencyAmountAtoms),
    },
  });
  const {
    data,
    isSuccess,
    sendTransaction,
    error,
    isLoading: isSigning,
  } = useSendTransaction(config);
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (params) => {
      Http.updateReward({
        txId: params.transactionHash,
        rewardId: store.reward.id,
      }).then(() => onSuccess());
    },
  });
  return (
    <div>
      {error && jsonify(error)}{" "}
      {!error && (
        <Button
          onClick={() => sendTransaction && sendTransaction()}
          isLoading={isLoading || isSigning}
        >
          Distribute
        </Button>
      )}
    </div>
  );
};
const DistributeNonEthReward = ({
  store,
  onSuccess,
}: DistributeRewardProps) => {
  const { config, error } = usePrepareContractWrite(store.contractWriteConfig!);
  const { write, data, isLoading: isSigning } = useContractWrite(config);
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (params) => {
      Http.updateReward({
        txId: params.transactionHash,
        rewardId: store.reward.id,
      }).then(() => onSuccess());
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
};

export default CompetitionDistributeReward;
