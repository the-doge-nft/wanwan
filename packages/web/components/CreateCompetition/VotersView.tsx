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
              className={css("flex", "justify-end", "w-full", "items-center")}
            >
              <AddManuallyButton setView={setView} />
            </div>
          )}
          {view === "manual" && (
            <div
              className={css("flex", "justify-end", "w-full", "items-center")}
            >
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
                  <Text size={TextSize.xl}>Holder will</Text>
                  <div
                    className={css(
                      "grid",
                      "grid-cols-2",
                      "w-full",
                      "border-[1px]",
                      "dark:border-neutral-600",
                      "border-neutral-400",
                      "border-dashed",
                      "p-2"
                    )}
                  >
                    <Text type={TextType.Grey}>Contract address:</Text>
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
                    <Text type={TextType.Grey}>Name:</Text>
                    <RenderIfDefined value={contract.name} />
                    <Text type={TextType.Grey}>Symbol:</Text>
                    <RenderIfDefined value={contract.symbol} />
                    <Text type={TextType.Grey}>Type:</Text>
                    <Text>{contract.tokenType}</Text>
                    <Text type={TextType.Grey}>Supply:</Text>
                    <RenderIfDefined
                      value={
                        contract.totalSupply
                          ? formatWithThousandsSeparators(contract.totalSupply)
                          : contract.totalSupply
                      }
                    />
                    <Text type={TextType.Grey}>Holders:</Text>
                    <Text>
                      {voteInputStore.isLoading && <Spinner />}
                      {!voteInputStore.isLoading && (
                        <>
                          {voteInputStore.holdersLength === 50000
                            ? `50,000+`
                            : formatWithThousandsSeparators(
                                voteInputStore.holdersLength as number
                              )}
                        </>
                      )}
                    </Text>
                  </div>
                </div>
              );
            }}
          />
        )}
      </div>
    );
  }
);

const RenderIfDefined = ({ value }: { value?: string | number }) => {
  if (value) {
    return <Text>{value}</Text>;
  }
  return <Text type={TextType.Grey}>-</Text>;
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
