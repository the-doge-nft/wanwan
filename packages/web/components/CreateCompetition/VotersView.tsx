import { observer } from "mobx-react-lite";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { css } from "../../helpers/css";
import { jsonify } from "../../helpers/strings";
import CreateCompetitionStore from "../../store/CreateCompetition/CreateCompetition.store";
import VoteInputStore from "../../store/CreateCompetition/VoteInput.store";
import Button from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormDisplay } from "../DSL/Form/FormControl";
import Text from "../DSL/Text/Text";
import { Buttons, CompetitionStoreProp } from "./CreateCompetition";
import Detail from "./Detail";
import Wallet from "./Wallet";

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
      {store.votersStore.hasVoters && (
        <div>
          {store.votersStore.votingRule.map((voter, i) => (
            <VotingItem
              key={`voting-item-${i}`}
              store={store}
              index={i}
              voteInput={voter}
            />
          ))}
        </div>
      )}
      <div className={css("mt-2")}>
        <Button block onClick={() => store.votersStore.addVoter()}>
          + Voting Rule
        </Button>
      </div>
      <Buttons store={store} />
    </Form>
  );
});

const VotingItem = ({
  store,
  index,
  voteInput,
}: {
  store: CreateCompetitionStore;
  index: number;
  voteInput: VoteInputStore;
}) => {
  const [view, setView] = useState<"wallet" | "manual" | null>(null);
  return (
    <div key={`voter-${index}`}>
      <div>
        <Text>*{index + 1}</Text>
      </div>
      <div className={css("flex", "items-center", "gap-2")}>
        <Button onClick={() => store.votersStore.removeVote(index)}>
          <IoCloseOutline size={12} />
        </Button>
        {view === null && (
          <div className={css("flex", "gap-2")}>
            <Button onClick={() => setView("wallet")}>wallet</Button>
            <Button onClick={() => setView("manual")}>manual</Button>
          </div>
        )}
        {view === "wallet" && <Wallet wallet={store.wallet!} />}
      </div>
      {jsonify(voteInput)}
    </div>
  );
};

export default VotersView;
