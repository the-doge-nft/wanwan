import { BigNumber } from "ethers";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { css } from "../../helpers/css";
import { CurrencyType, Reward } from "../../interfaces";
import Http from "../../services/http";
import RewardStore from "../../store/Reward.store";
import Button from "../DSL/Button/Button";
import Text, { TextSize, TextType } from "../DSL/Text/Text";

interface CompetitionRewardDistributionProps {
  reward: Reward;
  toAddress: string;
  onSuccess: () => void;
}

const CompetitionDistributeReward = observer(
  ({ reward, toAddress, onSuccess }: CompetitionRewardDistributionProps) => {
    const store = useMemo(
      () => new RewardStore(reward, toAddress),
      [reward, toAddress]
    );

    if (store.tokenType === CurrencyType.ETH) {
      return (
        <DistributeEthReward store={store} onSuccess={() => onSuccess()} />
      );
    }

    return (
      <DistributeNonEthReward store={store} onSuccess={() => onSuccess()} />
    );
  }
);

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
      Http.postRewardSettled({
        txId: params.transactionHash,
        rewardId: store.reward.id,
      }).then(() => onSuccess());
    },
  });
  useEffect(() => {
    // update the status to confirming when tx is signed
    if (data?.hash && !store.reward.txId) {
      store.updateRewardStatusConfirming(data.hash);
    }
  }, [store, data?.hash]);
  return (
    <div className={css("text-right")}>
      <Button
        onClick={() => sendTransaction && sendTransaction()}
        isLoading={isLoading || isSigning}
      >
        Distribute
      </Button>
      {error && (
        <div>
          <Text size={TextSize.xxs} type={TextType.Error}>
            {error.message}
          </Text>
        </div>
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
      Http.postRewardSettled({
        txId: params.transactionHash,
        rewardId: store.reward.id,
      }).then(() => onSuccess());
    },
  });
  useEffect(() => {
    // update the status to confirming when tx is signed
    if (data?.hash && !store.reward.txId) {
      store.updateRewardStatusConfirming(data.hash);
    }
  }, [store, data?.hash]);
  return (
    <div className={css("text-right")}>
      <Button
        onClick={() => write && write()}
        isLoading={isLoading || isSigning}
      >
        Distribute
      </Button>
      {error && (
        <div>
          <Text size={TextSize.xxs} type={TextType.Error}>
            {error.message}
          </Text>
        </div>
      )}
    </div>
  );
};

export default CompetitionDistributeReward;
