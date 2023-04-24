import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction, useState } from "react";
import { BsPencil, BsWallet2 } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { css } from "../../helpers/css";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import { abbreviate, getEtherscanURL, jsonify } from "../../helpers/strings";
import { TokenType } from "../../interfaces";
import CreateCompetitionStore from "../../store/CreateCompetition/CreateCompetition.store";
import VoteInputStore from "../../store/CreateCompetition/VoteInput.store";
import Button from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormDisplay } from "../DSL/Form/FormControl";
import Link from "../DSL/Link/Link";
import Spinner from "../DSL/Spinner/Spinner";
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
          {store.votersStore.votingRule.map((voteInputStore, i) => (
            <VotingItem
              key={`voting-item-${i}`}
              store={store}
              index={i}
              voteInputStore={voteInputStore}
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

const VotingItem = observer(
  ({
    store,
    index,
    voteInputStore,
  }: {
    store: CreateCompetitionStore;
    index: number;
    voteInputStore: VoteInputStore;
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
              className={css(
                "flex",
                "gap-2",
                "justify-around",
                "w-full",
                "h-8"
              )}
            >
              <AddFromWalletButton setView={setView} />
              <AddManuallyButton setView={setView} />
            </div>
          )}
          {view === "wallet" && (
            <div
              className={css(
                "flex",
                "justify-between",
                "w-full",
                "items-center"
              )}
            >
              <Text size={TextSize.xs} type={TextType.Grey}>
                Select voting rule based on your wallet holdings below
              </Text>
              <AddManuallyButton setView={setView} />
            </div>
          )}
          {view === "manual" && (
            <div
              className={css(
                "flex",
                "justify-between",
                "w-full",
                "items-center"
              )}
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
              voteInputStore.setInput(address as string, TokenType.ERC721);
            }}
            renderSelection={({ address, nfts }) => {
              console.log("NFTS", jsonify(nfts));
              const contract = nfts[0].contract;
              return (
                <div className={css("flex", "flex-col", "items-center")}>
                  <div className={css("grid", "grid-cols-2", "w-full")}>
                    <Text>Contract address:</Text>
                    <Link
                      isExternal
                      href={getEtherscanURL(
                        contract.address as string,
                        "token"
                      )}
                    >
                      <Text type={TextType.NoColor}>
                        {abbreviate(address as string)}
                      </Text>
                    </Link>
                    <Text>Name:</Text>
                    <Text>{contract.name}</Text>
                    <Text>Symbol:</Text>
                    <Text>{contract.symbol}</Text>
                    <Text>Token Type:</Text>
                    <Text>{contract.tokenType}</Text>
                    <Text>Total Supply:</Text>
                    <Text>{contract.totalSupply}</Text>
                  </div>

                  {voteInputStore.isLoading && (
                    <div className={css("flex", "items-center", "gap-1")}>
                      <Spinner />
                      <Text size={TextSize.xs} type={TextType.Grey}>
                        loading holders
                      </Text>
                    </div>
                  )}
                  {!voteInputStore.isLoading &&
                    voteInputStore.holdersLength !== undefined && (
                      <Text size={TextSize.xs} type={TextType.Grey}>
                        {formatWithThousandsSeparators(
                          voteInputStore.holdersLength
                        )}
                        {voteInputStore.holdersLength === 50000 && "+"}{" "}
                        {voteInputStore.holdersLength > 1
                          ? "holders"
                          : "holder"}
                      </Text>
                    )}
                  {/* {jsonify(contract)} */}
                </div>
              );
            }}
          />
        )}
      </div>
    );
  }
);

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
