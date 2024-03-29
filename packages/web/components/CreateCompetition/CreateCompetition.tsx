import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import CreateCompetitionStore, {
  CreateCompetitionView,
} from "../../store/CreateCompetition/CreateCompetition.store";
import Button, { Submit } from "../DSL/Button/Button";
import CuratorsView from "./CuratorsView";
import DescriptionView from "./DescriptionView";
import DetailsView from "./DetailsView";
import NameView from "./NameView";
import ReviewView from "./ReviewView";
import RewardsView from "./RewardsView";
import SuccessView from "./SuccessView";
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
      {store.currentView === CreateCompetitionView.Success && (
        <SuccessView store={store} />
      )}
    </>
  );
});

export const Buttons = observer(
  ({
    store,
    submitLabel,
    canGoNext = true,
    isLoading = false,
  }: CompetitionStoreProp & {
    canGoNext?: boolean;
    submitLabel?: string;
    isLoading?: boolean;
  }) => {
    return (
      <div className={css("w-full", "flex", "gap-2", "mt-4")}>
        <Button block onClick={() => store.goBack()} disabled={isLoading}>
          Back
        </Button>
        <Submit block disabled={!canGoNext} isLoading={isLoading}>
          {submitLabel ? submitLabel : "Next"}
        </Submit>
      </div>
    );
  }
);

export default CreateCompetition;
