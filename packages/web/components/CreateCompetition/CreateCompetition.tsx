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
  maxValue,
  minValue,
  required,
} from "../DSL/Form/validation";

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
    <Form onSubmit={(values) => store.onCompetitionSubmit(values)}>
      <div className={css("flex", "flex-col", "gap-2")}>
        <TextInput
          block
          label={"Name"}
          name={"name"}
          validate={required}
          disabled={store.isLoading}
        />
        <TextInput
          block
          label={"Description"}
          name={"description"}
          disabled={store.isLoading}
        />
        <div className={css("flex", "gap-2")}>
          <NumberInput
            block
            label={"Max user submissions"}
            name={"maxUserSubmissions"}
            validate={[required, minValue(1), maxValue(5)]}
            disabled={store.isLoading}
          />
          <DateInput
            block
            label={"Ends at"}
            name={"endsAt"}
            validate={required}
            // @next -- bad to have mixed validation here
            min={new Date().toISOString().split("T")[0]}
            defaultValue={new Date().toISOString().split("T")[0]}
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
        {/* rewards */}
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
  return <div>Success</div>;
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
                label={`curator ${index + 1}`}
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
            - curator
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
        <>
          {Array.from(Array(store.rewardsCount)).map((_, index) => {
            return (
              <div
                key={`${store.REWARDS_INPUT_PREFIX}-${index}`}
                className={css()}
              >
                <div className={css("text-xs", "text-slate-600")}>
                  {index + 1} place
                </div>
                <div className={css("flex", "gap-2")}>
                  <SelectInput
                    block
                    label={"Token Type"}
                    name={`${store.REWARDS_INPUT_PREFIX}-${store.REWARDS_INPUT_TYPE_PREFIX}-${index}`}
                    items={store.rewardsTypeSelectItems}
                    validate={required}
                    defaultValue={store.rewardsTypeSelectItems[0].id}
                  />
                  <NumberInput
                    block
                    label={"Amount"}
                    name={`${store.REWARDS_INPUT_PREFIX}-${store.REWARDS_INPUT_NUMBER_PREFIX}-${index}`}
                    validate={required}
                  />
                </div>
                <div className={css("mt-2")}>
                  <TextInput
                    block
                    label={"Token Address"}
                    name={`${store.REWARDS_INPUT_PREFIX}-${store.REWARDS_INPUT_ADDRESS_PREFIX}-${index}`}
                    validate={[required, isEthereumAddress]}
                  />
                </div>
              </div>
            );
          })}
        </>
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
