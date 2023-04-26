import { observer } from "mobx-react-lite";
import { useState } from "react";
import { BsCheckLg, BsPencil, BsWallet2 } from "react-icons/bs";
import { IoCloseOutline, IoPersonOutline } from "react-icons/io5";
import { css } from "../../helpers/css";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import {
  abbreviate,
  getEtherscanURL,
  getLooksRareCollectionURL,
} from "../../helpers/strings";
import { TokenType } from "../../interfaces";
import CreateCompetitionStore from "../../store/CreateCompetition/CreateCompetition.store";
import VoteInputStore, {
  VoteInputView,
} from "../../store/CreateCompetition/VoteInput.store";
import Button from "../DSL/Button/Button";
import Form from "../DSL/Form/Form";
import { FormDisplay } from "../DSL/Form/FormControl";
import TextInput from "../DSL/Form/TextInput";
import { isEthereumAddress, required } from "../DSL/Form/validation";
import Link, { LinkType } from "../DSL/Link/Link";
import Spinner, { SpinnerSize } from "../DSL/Spinner/Spinner";
import Text, { TextSize, TextType } from "../DSL/Text/Text";
import { Buttons, CompetitionStoreProp } from "./CreateCompetition";
import Detail from "./Detail";
import Wallet, { NftPreview } from "./Wallet";

const VotersView = observer(({ store }: CompetitionStoreProp) => {
  return (
    <>
      <FormDisplay
        label={"Voters"}
        description={"Who should be able to vote on memes in this competition?"}
      />
      {!store.votersStore.hasVoters && (
        <Detail>Anyone with an Ethereum wallet will be able to vote</Detail>
      )}
      {store.votersStore.hasVoters && (
        <div className={css("flex", "flex-col", "gap-4")}>
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
        <Button
          block
          onClick={() => store.votersStore.addVoter()}
          disabled={!store.votersStore.canAddVote}
        >
          + Voting Rule
        </Button>
      </div>
      <Form onSubmit={async () => store.onVotersSubmit()}>
        <Buttons
          store={store}
          canGoNext={store.votersStore.allVotersConfirmed}
        />
      </Form>
    </>
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
    const [showInfo, setShowInfo] = useState(false);
    return (
      <div key={`voter-${index}`} className={css("flex", "flex-col")}>
        <Text>*{index + 1}</Text>
        <div className={css("flex", "items-center", "gap-2")}>
          <Button onClick={() => store.votersStore.removeVote(index)}>
            <IoCloseOutline size={12} />
          </Button>
          {voteInputStore.view === VoteInputView.Choose && (
            <div
              className={css(
                "flex",
                "gap-2",
                "justify-around",
                "w-full",
                "h-8"
              )}
            >
              <AddFromWalletButton store={voteInputStore} />
              <AddManuallyButton store={voteInputStore} />
            </div>
          )}
          {(voteInputStore.view === VoteInputView.Wallet ||
            voteInputStore.view === VoteInputView.Manual) && (
            <div
              className={css(
                "flex",
                "justify-between",
                "w-full",
                "items-center"
              )}
            >
              <Text>
                {voteInputStore.name
                  ? voteInputStore.name
                  : voteInputStore.contractAddress &&
                    abbreviate(voteInputStore.contractAddress)}
              </Text>
              {!voteInputStore.isConfirmed &&
                voteInputStore.contractAddress && (
                  <Button onClick={() => (voteInputStore.isConfirmed = true)}>
                    <BsCheckLg size={14} />
                  </Button>
                )}
              {voteInputStore.isConfirmed && (
                <Button onClick={() => (voteInputStore.isConfirmed = false)}>
                  <BsPencil size={14} />
                </Button>
              )}
            </div>
          )}
        </div>
        {voteInputStore.view === VoteInputView.Wallet &&
          !voteInputStore.isConfirmed && (
            <Wallet
              wallet={store.wallet!}
              showAll={false}
              selectedAddress={voteInputStore.contractAddress}
              filterContractAddresses={store.votersStore.getAddressesToHide(
                index
              )}
              onERC721AddressSelected={({ address, nfts }) => {
                voteInputStore.setInput(
                  address,
                  TokenType.ERC721,
                  nfts?.[0].contract.name
                );
              }}
              renderSelection={({ address, nfts }) => {
                const contract = nfts?.[0].contract;
                return (
                  <div
                    className={css("flex", "flex-col", "items-center", "grow")}
                  >
                    {!contract && (
                      <div className={css("text-center")}>
                        <Text>
                          Select an address to token-gate voting to said
                          collection
                        </Text>
                      </div>
                    )}
                    {contract && (
                      <>
                        <div className={css("text-center")}>
                          <Text>
                            Holders of{" "}
                            <Link
                              isExternal
                              href={getLooksRareCollectionURL(contract.address)}
                            >
                              {contract.name
                                ? contract.name
                                : abbreviate(contract.address)}
                            </Link>{" "}
                            will be able to vote
                          </Text>
                        </div>
                        <div className={css("mt-4", "flex", "gap-1")}>
                          {!voteInputStore.isLoadingNfts &&
                            voteInputStore.nfts
                              .slice(0, 5)
                              .map((nft) => (
                                <NftPreview
                                  key={`nft-preview-${nft.contract.address}-${nft.tokenId}`}
                                  size={"sm"}
                                  nft={nft}
                                  showName={false}
                                />
                              ))}
                          {voteInputStore.isLoadingNfts && <Spinner />}
                        </div>

                        {showInfo && (
                          <div
                            className={css(
                              "grow",
                              "w-full",
                              "flex",
                              "justify-center",
                              "flex-col",
                              "gap-3"
                            )}
                          >
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
                              <Text type={TextType.Grey} size={TextSize.xs}>
                                Contract address:
                              </Text>
                              <Link
                                isExternal
                                type={LinkType.Secondary}
                                href={getEtherscanURL(
                                  contract.address as string,
                                  "token"
                                )}
                              >
                                <Text
                                  type={TextType.NoColor}
                                  size={TextSize.xs}
                                >
                                  {abbreviate(address as string)}
                                </Text>
                              </Link>
                              <Text type={TextType.Grey} size={TextSize.xs}>
                                Type:
                              </Text>
                              <Text size={TextSize.xs}>
                                {contract.tokenType}
                              </Text>
                              <Text type={TextType.Grey} size={TextSize.xs}>
                                Supply:
                              </Text>
                              <RenderIfDefined
                                value={
                                  contract.totalSupply
                                    ? formatWithThousandsSeparators(
                                        contract.totalSupply
                                      )
                                    : contract.totalSupply
                                }
                              />
                              <Text type={TextType.Grey} size={TextSize.xs}>
                                Holders:
                              </Text>
                              <Text size={TextSize.xs}>
                                {voteInputStore.isLoadingHolders && (
                                  <Spinner size={SpinnerSize.xs} />
                                )}
                                {!voteInputStore.isLoadingHolders &&
                                  voteInputStore.holderLengthTitle}
                              </Text>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              }}
            />
          )}
        {voteInputStore.view === VoteInputView.Manual && (
          <div className={css("mt-2")}>
            <Form onSubmit={async () => {}}>
              <TextInput
                block
                label={"Token Address"}
                name={"tokenAddress"}
                validate={[required, isEthereumAddress]}
              />
            </Form>
          </div>
        )}
      </div>
    );
  }
);

const RenderIfDefined = ({ value }: { value?: string | number }) => {
  if (value) {
    return <Text size={TextSize.xs}>{value}</Text>;
  }
  return (
    <Text type={TextType.Grey} size={TextSize.xs}>
      -
    </Text>
  );
};

const AddFromWalletButton = ({
  store,
  showText = true,
}: {
  store: VoteInputStore;
  showText?: boolean;
}) => {
  return (
    <Button onClick={() => (store.view = VoteInputView.Wallet)}>
      <div className={css("flex", "items-center", "gap-1.5")}>
        <BsWallet2 size={14} />
        {showText && <Text size={TextSize.xs}>wallet</Text>}
      </div>
    </Button>
  );
};

const AddManuallyButton = ({
  store,
  showText = true,
}: {
  store: VoteInputStore;
  showText?: boolean;
}) => {
  return (
    <Button onClick={() => (store.view = VoteInputView.Manual)}>
      <div className={css("flex", "items-center", "gap-1.5")}>
        <IoPersonOutline size={14} />
        {showText && <Text size={TextSize.xs}>manual</Text>}
      </div>
    </Button>
  );
};

export default VotersView;
