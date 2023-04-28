import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import AppStore from "../../store/App.store";
import CreateCompetitionStore, {
  CreateCompetitionView,
} from "../../store/CreateCompetition/CreateCompetition.store";
import Button, { Submit } from "../DSL/Button/Button";
import { Divider } from "../DSL/Divider/Divider";
import DateInput from "../DSL/Form/DateInput";
import Form from "../DSL/Form/Form";
import FormError from "../DSL/Form/FormError";
import NumberInput from "../DSL/Form/NumberInput";
import TextInput from "../DSL/Form/TextInput";
import {
  maxDate,
  maxValue,
  minDate,
  minValue,
  required,
} from "../DSL/Form/validation";
import CuratorsView from "./CuratorsView";
import DescriptionView from "./DescriptionView";
import DetailsView from "./DetailsView";
import NameView from "./NameView";
import ReviewView from "./ReviewView";
import RewardsView from "./RewardsView";
import VotersView from "./VotersView";

export interface CompetitionStoreProp {
  store: CreateCompetitionStore;
}

const CreateCompetition = observer(({ store }: CompetitionStoreProp) => {
  return (
    <>
      {store.currentView === CreateCompetitionView.Name && (
        <NameView store={store} />
      )}
      {store.currentView === CreateCompetitionView.Description && (
        <DescriptionView store={store} />
      )}
      {store.currentView === CreateCompetitionView.Details && (
        <DetailsView store={store} />
      )}
      {store.currentView === CreateCompetitionView.Voters && (
        <VotersView store={store} />
      )}
      {store.currentView === CreateCompetitionView.Curators && (
        <CuratorsView store={store} />
      )}
      {store.currentView === CreateCompetitionView.Rewards && (
        <RewardsView store={store} />
      )}
      {store.currentView === CreateCompetitionView.Review && (
        <ReviewView store={store} />
      )}
    </>
  );
});

export const Buttons = observer(
  ({
    store,
    canGoNext = true,
  }: CompetitionStoreProp & { canGoNext?: boolean }) => {
    return (
      <div className={css("w-full", "flex", "gap-2", "mt-4")}>
        <Button block onClick={() => store.goBack()}>
          Back
        </Button>
        <Submit block disabled={!canGoNext}>
          Next
        </Submit>
      </div>
    );
  }
);

const CreateView = observer(({ store }: CompetitionStoreProp) => {
  return (
    <Form onSubmit={async (values: any) => store.onCompetitionSubmit(values)}>
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
        {/* <Curators store={store} /> */}
        <div className={css("mt-2", "mb-1")}>
          <Divider />
        </div>
        {/* <Rewards store={store} /> */}
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

export default CreateCompetition;
