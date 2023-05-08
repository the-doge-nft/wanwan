import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import Button, { Submit } from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormDisplay } from "../DSL/Form/FormControl";
import TipTapEditor from "../TipTapEditor/TipTapEditor";
import { CompetitionStoreProp } from "./CreateCompetition";

const DescriptionView = observer(({ store }: CompetitionStoreProp) => {
  return (
    <Form onSubmit={async (values: any) => store.onDescriptionSubmit()}>
      <FormDisplay
        label={"Description"}
        description={"What do you want creators and voters to know?"}
      />
      <div className={css("flex", "flex-col", "gap-2")}>
        <div>
          <TipTapEditor onUpdate={(json) => (store.description = json)} />
        </div>
        <div className={css("w-full", "flex", "gap-2", "mt-4")}>
          <Button block onClick={() => store.goBack()}>
            Back
          </Button>
          <Submit block>Next</Submit>
        </div>
      </div>
    </Form>
  );
});

export default DescriptionView;
