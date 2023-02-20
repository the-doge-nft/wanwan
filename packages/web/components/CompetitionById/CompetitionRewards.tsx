import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import { jsonify } from "../../helpers/strings";
import CompetitionByIdStore from "../../store/CompetitionId.store";
import Code from "../DSL/Code/Code";
import Text, { TextSize, TextType } from "../DSL/Text/Text";
import CompetitionDistributeReward from "./CompetitionDistributeReward";

interface CompetitionRewardsProps {
  store: CompetitionByIdStore;
}

const CompetitionRewards = observer(({ store }: CompetitionRewardsProps) => {
  return (
    <div className={css("flex", "flex-col", "gap-1")}>
      {store.rewards.map((reward, index) => {
        console.log("debug:: re-render competition rewards");
        const winnerAddress = store.memes?.[index]?.user?.address;
        return (
          <div key={`reward-${reward.id}`}>
            {!store.competition.isActive ? (
              <>
                {store.isCreator && (
                  <>
                    {winnerAddress && (
                      <CompetitionDistributeReward
                        reward={reward}
                        toAddress={winnerAddress}
                        onSuccess={() => store.getCompetition()}
                      />
                    )}
                    {!winnerAddress && <Text>no winner</Text>}
                  </>
                )}
                {!store.isCreator && (
                  <Text size={TextSize.xs} type={TextType.Grey}>
                    waiting on distribution
                  </Text>
                )}
              </>
            ) : (
              <div>
                {reward.txId && <Text size={TextSize.xs}>{reward.txId}</Text>}
                {!reward.txId && <Text>waiting on distribution</Text>}
              </div>
            )}
            <div className={css("break-words")}>
              <Code>{jsonify(reward)}</Code>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default CompetitionRewards;
