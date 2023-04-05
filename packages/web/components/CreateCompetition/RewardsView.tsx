import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import { TokenType } from "../../interfaces";
import Button from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormDisplay } from "../DSL/Form/FormControl";
import NumberInput from "../DSL/Form/NumberInput";
import SelectInput from "../DSL/Form/SelectInput";
import TextInput from "../DSL/Form/TextInput";
import { isEthereumAddress, minValue, required } from "../DSL/Form/validation";
import { Buttons, CompetitionStoreProp } from "./CreateCompetition";

const RewardsView = observer(({ store }: CompetitionStoreProp) => {
  return (
    <Form onSubmit={async () => store.onRewardsSubmit()}>
      <FormDisplay
        label={"Rewards"}
        description={"Incentivise your competition by rewarding the top memes"}
      />
      {store.isRewardsVisible && (
        <div className={css("flex", "flex-col", "gap-6")}>
          {Array.from(Array(store.rewardsCount)).map((_, index) => {
            const typeKey = store.getInputKey("type", index);
            const tokenIdKey = store.getInputKey("token-id", index);
            const amountKey = store.getInputKey("amount", index);
            const addressKey = store.getInputKey("address", index);
            const place = index + 1;
            let prefix = "st";
            if (place === 2) {
              prefix = "nd";
            } else if (place === 3) {
              prefix = "rd";
            }
            return (
              <div
                key={`${store.REWARDS_INPUT_PREFIX}-${index}`}
                className={css()}
              >
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
                <div className={css("flex", "gap-2")}>
                  <SelectInput
                    block
                    name={typeKey}
                    label={"Token Type"}
                    value={store.rewardInputTypes[typeKey]}
                    onChange={(value) => store.onTypeInputChange(index, value)}
                    items={store.rewardsTypeSelectItems}
                    validate={required}
                    defaultValue={store.rewardsTypeSelectItems[0].id}
                  />
                  {store.getShowTokenIdInput(typeKey) && (
                    <NumberInput
                      block
                      name={tokenIdKey}
                      label={"Token ID"}
                      validate={[required, minValue(0)]}
                    />
                  )}
                  <NumberInput
                    block
                    label={"Amount"}
                    value={store.rewardInputAmounts[amountKey]}
                    onChange={(value) =>
                      store.onAmountInputChange(amountKey, value)
                    }
                    name={amountKey}
                    validate={[
                      required,
                      minValue(
                        store.rewardInputTypes[typeKey] === TokenType.ERC20
                          ? 1e-18
                          : 1
                      ),
                    ]}
                    disabled={store.getIsAmountDisabled(typeKey)}
                  />
                </div>
                <div className={css("mt-2")}>
                  <TextInput
                    block
                    label={"Token Address"}
                    name={addressKey}
                    validate={[required, isEthereumAddress]}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className={css("flex", "items-center", "gap-2", "mt-2")}>
        <Button
          block
          onClick={() => store.addReward()}
          disabled={!store.canAddReward}
        >
          + Reward
        </Button>
        {store.showRemoveReward && (
          <Button block onClick={() => store.removeReward()}>
            - Reward
          </Button>
        )}
      </div>
      <Buttons store={store} />
    </Form>
  );
});

export default RewardsView;
