import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import { Submit } from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import TextInput from "../DSL/Form/TextInput";
import { required } from "../DSL/Form/validation";
import { CompetitionStoreProp } from "./CreateCompetition";

const NameView = observer(({ store }: CompetitionStoreProp) => {
  return (
    <Form onSubmit={async (values: any) => store.onNameSubmit(values)}>
      <div className={css("flex", "flex-col", "gap-2")}>
        <TextInput
          block
          label={"Name"}
          name={"name"}
          description={"What should it be named?"}
          validate={required}
          value={store.name}
          onChange={(val) => (store.name = val)}
        />
        <Submit block>Next</Submit>
      </div>
    </Form>
  );
});

export default NameView;
