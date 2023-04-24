import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction, useState } from "react";
import { BsPencil, BsWallet2 } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { css } from "../../helpers/css";
import { abbreviate, getEtherscanURL } from "../../helpers/strings";
import { TokenType } from "../../interfaces";
import CreateCompetitionStore from "../../store/CreateCompetition/CreateCompetition.store";
import VoteInputStore from "../../store/CreateCompetition/VoteInput.store";
import Button from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormDisplay } from "../DSL/Form/FormControl";
import Link from "../DSL/Link/Link";
import Text, { TextSize, TextType } from "../DSL/Text/Text";
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
          <div
            className={css("flex", "gap-2", "justify-around", "w-full", "h-8")}
          >
            <AddFromWalletButton setView={setView} />
            <AddManuallyButton setView={setView} />
          </div>
        )}
        {view === "wallet" && (
          <div
            className={css("flex", "justify-between", "w-full", "items-center")}
          >
            <Text size={TextSize.xs} type={TextType.Grey}>
              Select voting rule based on your wallet holdings below
            </Text>
            <AddManuallyButton setView={setView} />
          </div>
        )}
        {view === "manual" && (
          <div
            className={css("flex", "justify-between", "w-full", "items-center")}
          >
            <Text size={TextSize.xs} type={TextType.Grey}>
              Add a contract address below
            </Text>
            <AddFromWalletButton setView={setView} />
          </div>
        )}
      </div>
      {view === "wallet" && (
        <Wallet
          wallet={store.wallet!}
          showAll={false}
          onERC721AddressClick={(address) => {
            voteInput.setAddress(address as string);
            voteInput.setTokenType(TokenType.ERC721);
          }}
          renderSelection={(address) => {
            return (
              <div className={css("flex", "flex-col")}>
                <Text>Contract address:</Text>
                <Link
                  isExternal
                  href={getEtherscanURL(address as string, "token")}
                >
                  {abbreviate(address as string)}
                </Link>
              </div>
            );
          }}
        />
      )}
    </div>
  );
};

const AddFromWalletButton = ({
  setView,
}: {
  setView: Dispatch<SetStateAction<"wallet" | "manual" | null>>;
}) => {
  return (
    <Button onClick={() => setView("wallet")}>
      <div className={css("flex", "items-center", "gap-1.5")}>
        <BsWallet2 size={14} />
        <Text size={TextSize.xs}>from your wallet</Text>
      </div>
    </Button>
  );
};

const AddManuallyButton = ({
  setView,
}: {
  setView: Dispatch<SetStateAction<"wallet" | "manual" | null>>;
}) => {
  return (
    <Button onClick={() => setView("manual")}>
      <div className={css("flex", "items-center", "gap-1.5")}>
        <BsPencil size={14} />
        <Text size={TextSize.xs}>add manually</Text>
      </div>
    </Button>
  );
};

export default VotersView;
