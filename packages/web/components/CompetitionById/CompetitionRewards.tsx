import { ethers } from "ethers";
import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import {
  abbreviate,
  getEtherscanURL,
  getOpenSeaURL,
} from "../../helpers/strings";
import { RewardStatus } from "../../interfaces";
import CompetitionByIdStore from "../../store/CompetitionById/CompetitionById.store";
import Link from "../DSL/Link/Link";
import Text, { TextSize, TextType } from "../DSL/Text/Text";
import CompetitionDistributeReward from "./CompetitionDistributeReward";

interface CompetitionRewardsProps {
  store: CompetitionByIdStore;
}

const CompetitionRewards = observer(({ store }: CompetitionRewardsProps) => {
  return (
    <div className={css("flex", "flex-col", "gap-1")}>
      {store.rewards.map((reward, index) => {
        // @next -- winners should not be selected based on order here, address should be in Reward interface
        const winnerAddress = store.memes?.[index]?.user?.address;
        return (
          <div
            key={`reward-${reward.id}`}
            className={css("grid", "grid-cols-6")}
          >
            <div className={css("flex", "items-center", "gap-2", "col-span-4")}>
              <Link
                href={
                  store.getIsRewardNFT(reward.id)
                    ? getOpenSeaURL(
                        reward.currency.contractAddress,
                        reward.currencyTokenId
                      )
                    : reward.currency.type === "ETH"
                    ? "https://ethereum.org"
                    : getEtherscanURL(reward.currency.contractAddress, "token")
                }
                isExternal
              />
              <Text size={TextSize.sm}>{reward.competitionRank}</Text>
              <Text size={TextSize.sm}>
                {reward.currency.name ? reward.currency.name : "no name found"}{" "}
                (
                {formatWithThousandsSeparators(
                  Number(
                    ethers.utils.formatUnits(
                      reward.currencyAmountAtoms,
                      reward.currency.decimals
                    )
                  )
                )}
                )
              </Text>
            </div>
            <div
              className={css(
                "flex",
                "justify-end",
                "items-center",
                "col-span-2"
              )}
            >
              {store.competition.isActive ? (
                <>
                  {reward.txId && <Text size={TextSize.xs}>{reward.txId}</Text>}
                </>
              ) : (
                <>
                  {store.isCreator &&
                    winnerAddress &&
                    !reward.txId &&
                    reward.status !== RewardStatus.Failed && (
                      <CompetitionDistributeReward
                        reward={reward}
                        toAddress={winnerAddress}
                        onSuccess={() => store.getCompetition()}
                      />
                    )}
                  {reward.status === RewardStatus.Failed && (
                    <Text type={TextType.Error}>
                      could not validate reward sent
                    </Text>
                  )}
                  {!store.isCreator && !reward.txId && winnerAddress && (
                    <Text size={TextSize.xs} type={TextType.Grey}>
                      waiting on distribution
                    </Text>
                  )}
                  {!winnerAddress && (
                    <Text type={TextType.Grey}>no winner</Text>
                  )}
                  {reward.txId && (
                    <Link isExternal href={getEtherscanURL(reward.txId, "tx")}>
                      <Text type={TextType.NoColor}>
                        {abbreviate(reward.txId)}
                      </Text>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
      {store.rewards.length === 0 && (
        <div
          className={css(
            "text-gray-600",
            "dark:text-neutral-500",
            "text-xs",
            "text-center",
            "py-4"
          )}
        >
          <Text size={TextSize.sm} type={TextType.Grey}>
            No rewards
          </Text>
        </div>
      )}
    </div>
  );
});

export default CompetitionRewards;
