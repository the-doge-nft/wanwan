import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import Button from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormDisplay } from "../DSL/Form/FormControl";
import { Buttons, CompetitionStoreProp } from "./CreateCompetition";

const RewardsView = observer(({ store }: CompetitionStoreProp) => {
  return (
    <Form onSubmit={async () => store.onRewardsSubmit()}>
      <FormDisplay
        label={"Rewards"}
        description={"Incentivise your competition by rewarding the top memes"}
      />
      {store.rewardStore.isRewardsVisible && (
        <div className={css("flex", "flex-col", "gap-6")}>
          {store.rewardStore.rewards.map((rewardStore, index) => {
            const place = index + 1;
            let prefix = "st";
            if (place === 2) {
              prefix = "nd";
            } else if (place === 3) {
              prefix = "rd";
            }
            return (
              <div key={`reward-input-${index}`} className={css()}>
                <div
                  className={css(
                    "text-xs",
                    "text-neutral-600",
                    "dark:text-neutral-400",
                    "mb-1"
                  )}
                >
                  {place}
                  {prefix} place
                </div>
                <div className={css("flex", "gap-2")}></div>
              </div>
            );
          })}
        </div>
      )}
      <div className={css("flex", "items-center", "gap-2", "mt-2")}>
        <Button
          block
          onClick={() => store.rewardStore.addReward()}
          disabled={!store.rewardStore.canAddReward}
        >
          + Reward
        </Button>
      </div>
      <Buttons store={store} />
    </Form>
  );
});

export default RewardsView;
