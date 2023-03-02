import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import CreateCompetitionStore, {
  CreateCompetitionView,
} from "../../store/CreateCompetition.store";
import Button, { Submit } from "../DSL/Button/Button";
import { Divider } from "../DSL/Divider/Divider";
import DateInput from "../DSL/Form/DateInput";
import Form from "../DSL/Form/Form";
import { FormDescription } from "../DSL/Form/FormControl";
import FormError from "../DSL/Form/FormError";
import NumberInput from "../DSL/Form/NumberInput";
import SelectInput from "../DSL/Form/SelectInput";
import TextInput from "../DSL/Form/TextInput";
import {
  isEthereumAddress,
  maxDate,
  maxValue,
  minDate,
  minValue,
  required,
} from "../DSL/Form/validation";
import Text, { TextSize } from "../DSL/Text/Text";

interface CompetitionStoreProp {
  store: CreateCompetitionStore;
}

const CreateCompetition: React.FC<CompetitionStoreProp> = observer(
  ({ store }) => {
    return (
      <>
        {store.currentView === CreateCompetitionView.Create && (
          <CreateView store={store} />
        )}
        {store.currentView === CreateCompetitionView.Success && <SuccessView />}
      </>
    );
  }
);

const CreateView: React.FC<CompetitionStoreProp> = observer(({ store }) => {
  return (
    <Form onSubmit={async (values) => store.onCompetitionSubmit(values)}>
      <div className={css("flex", "flex-col", "gap-2")}>
        <TextInput
          block
          label={"Name"}
          name={"name"}
          validate={required}
          disabled={store.isLoading}
        />
        <TextInput
          type={"textarea"}
          block
          label={"Description"}
          name={"description"}
          disabled={store.isLoading}
        />
        <div className={css("flex", "gap-2")}>
          <NumberInput
            block
            label={"Max subs per user"}
            name={"maxUserSubmissions"}
            validate={[required, minValue(1), maxValue(5)]}
            disabled={store.isLoading}
          />
          <DateInput
            block
            type={"datetime-local"}
            label={"Ends at"}
            name={"endsAt"}
            validate={[
              required,
              minDate(store.minEndsAtDate),
              maxDate(store.maxEndsAtDate),
            ]}
            defaultValue={store.defaultEndsAtDate}
            disabled={store.isLoading}
          />
        </div>
        <div className={css("mt-2", "mb-1")}>
          <Divider />
        </div>
        <Curators store={store} />
        <div className={css("mt-2", "mb-1")}>
          <Divider />
        </div>
        <Rewards store={store} />
        <div className={css("mt-2")}>
          <Divider />
        </div>
        <FormError />
        <div className={css("mt-4", "flex", "gap-2")}>
          <Submit block isLoading={store.isLoading} />
          <Button
            block
            onClick={() =>
              (AppStore.modals.isCreateCompetitionModalOpen = false)
            }
          >
            Cancel
          </Button>
        </div>
      </div>
    </Form>
  );
});

const SuccessView = () => {
  return (
    <div>
      <div
        className={css(
          "text-center",
          "flex",
          "items-center",
          "gap-2",
          "justify-center"
        )}
      >
        <Text>~~~</Text>
        <Text size={TextSize.lg}>Competition Created</Text>
        <Text>~~~</Text>
      </div>
    </div>
  );
};

const Curators: React.FC<CompetitionStoreProp> = observer(({ store }) => {
  return (
    <>
      <FormDescription>
        Users who can remove memes from your competition
      </FormDescription>
      {store.isCuratorsVisible && (
        <>
          {Array.from(Array(store.curatorCount)).map((_, index) => {
            const key = `${store.CREATOR_INPUT_PREFIX}-${index}`;
            return (
              <TextInput
                block
                key={key}
                name={key}
                label={`Curator ${index + 1}`}
                validate={[required, isEthereumAddress]}
              />
            );
          })}
        </>
      )}
      <div className={css("flex", "items-center", "gap-2")}>
        <Button
          block
          onClick={() => store.addCurator()}
          disabled={!store.canAddCurator}
        >
          + Curator
        </Button>
        {store.showRemoveCurator && (
          <Button block onClick={() => store.removeCurator()}>
            - Curator
          </Button>
        )}
      </div>
    </>
  );
});

const Rewards: React.FC<CompetitionStoreProp> = observer(({ store }) => {
  return (
    <>
      <FormDescription>
        Incentivise your competition by rewarding the top memes
      </FormDescription>
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
                    validate={[required, minValue(1)]}
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
      <div className={css("flex", "items-center", "gap-2")}>
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
    </>
  );
});

export default CreateCompetition;
