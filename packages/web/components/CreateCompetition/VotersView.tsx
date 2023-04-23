import { observer } from "mobx-react-lite";
import { css } from "../../helpers/css";
import Button from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormDisplay } from "../DSL/Form/FormControl";
import { Buttons, CompetitionStoreProp } from "./CreateCompetition";
import Detail from "./Detail";

const VotersView = observer(({ store }: CompetitionStoreProp) => {
  return (
    <Form onSubmit={async () => store.onVotersSubmit()}>
      <FormDisplay
        label={"Voters"}
        description={"Who should be able to vote on memes in this competition?"}
      />
      {!store.votersStore.hasVoters && (
        <Detail>Anyone with an Ethereum wallet will be able to vote</Detail>
      )}
      <div className={css("mt-2")}>
        <Button block>+ Voting Rule</Button>
      </div>
      <Buttons store={store} />
    </Form>
  );
});

export default VotersView;
