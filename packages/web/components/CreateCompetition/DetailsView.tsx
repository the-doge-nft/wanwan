import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import DateInput from "../DSL/Form/DateInput";
import Form from "../DSL/Form/Form";
import NumberInput from "../DSL/Form/NumberInput";
import {
  maxDate,
  maxValue,
  minDate,
  minValue,
  required,
} from "../DSL/Form/validation";
import { Buttons, CompetitionStoreProp } from "./CreateCompetition";

const DetailsView = observer(({ store }: CompetitionStoreProp) => {
  return (
    <Form onSubmit={async () => store.onDetailsSubmit()}>
      <div className={css("flex", "flex-col", "gap-2")}>
        <NumberInput
          block
          label={"Max submissions per user"}
          description={"How many submissions can a user make?"}
          name={"maxUserSubmissions"}
          validate={[required, minValue(1), maxValue(5)]}
          placeholder={"1"}
          disabled={store.isLoading}
          value={store.maxUserSubmissions}
          onChange={(val) => (store.maxUserSubmissions = val)}
        />
        <DateInput
          block
          description={"When does your competition end?"}
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
          value={store.endsAt}
          onChange={(val) => (store.endsAt = val)}
        />
        <Buttons store={store} />
      </div>
    </Form>
  );
});

export default DetailsView;
