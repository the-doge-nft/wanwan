import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import CreateCompetitionStore, {
  CreateCompetitionView,
} from "../../store/CreateCompetition.store";
import Button, { Submit } from "../DSL/Button/Button";
import { Divider } from "../DSL/Divider/Divider";
import DateInput from "../DSL/Form/DateInput";
import Form from "../DSL/Form/Form";
import FormError from "../DSL/Form/FormError";
import NumberInput from "../DSL/Form/NumberInput";
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
          label={"name"}
          name={"name"}
          validate={required}
          disabled={store.isLoading}
        />
        <TextInput
          block
          label={"description"}
          name={"description"}
          disabled={store.isLoading}
        />
        <NumberInput
          block
          label={"max user submissions"}
          name={"maxUserSubmissions"}
          description={"total amount of memes a single user can submit"}
          validate={[required, minValue(1), maxValue(5)]}
          disabled={store.isLoading}
        />
        <DateInput
          block
          label={"ends at"}
          name={"endsAt"}
          description={"when your competition ends"}
          validate={required}
          // @next -- bad to have mixed validation here
          min={new Date().toISOString().split("T")[0]}
          defaultValue={new Date().toISOString().split("T")[0]}
          disabled={store.isLoading}
        />
        <div className={css("mt-3", "mb-2.5")}>
          <Divider />
        </div>
        <Curators store={store} />
        <div className={css("mt-3", "mb-3")}>
          <Divider />
        </div>
        {/* rewards */}
        <Rewards store={store} />
        <FormError />
        <div className={css("mt-4")}>
          <Submit block isLoading={store.isLoading} />
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
      {store.isCuratorsVisible && (
        <>
          {Array.from(Array(store.curatorCount)).map((_, index) => (
            <TextInput
              block
              key={`${store.CREATOR_INPUT_PREFIX}-${index}`}
              name={`${store.CREATOR_INPUT_PREFIX}-${index}`}
              label={`curator ${index + 1}`}
              validate={[required, isEthereumAddress]}
            />
          ))}
        </>
      )}
      <div className={css("flex", "items-center", "gap-10")}>
        <Button block onClick={() => store.addCurator()}>
          + curator
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
  return <div></div>;
});

export default CreateCompetition;
