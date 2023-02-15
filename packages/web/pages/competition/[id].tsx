import { format } from "date-fns";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { Address, useContractWrite, usePrepareContractWrite } from "wagmi";
import Button from "../../components/DSL/Button/Button";
import Input from "../../components/DSL/Input/Input";
import Link, { LinkType } from "../../components/DSL/Link/Link";
import Pane, { PaneType } from "../../components/DSL/Pane/Pane";
import Text, { TextSize, TextType } from "../../components/DSL/Text/Text";
import CompetitionSubmissions from "../../components/MemeSubmission/CompetitionSubmissions";
import MemeSelector from "../../components/MemeSubmission/MemeSelector";
import SelectedMemesForSubmission from "../../components/MemeSubmission/SelectedMemesForSubmission";
import UserSubmissions from "../../components/MemeSubmission/UserSubmissions";
import { css } from "../../helpers/css";
import { abbreviate, getEtherscanURL, jsonify } from "../../helpers/strings";
import {
  Competition,
  CompetitionMeme,
  Reward,
  TokenType,
} from "../../interfaces";
import AppLayout from "../../layouts/App.layout";
import http from "../../services/http";
import redirectTo404 from "../../services/redirect/404";
import { default as CompetitionByIdStore } from "../../store/CompetitionId.store";

import erc1155Abi from "../../services/abis/erc1155";
import erc20Abi from "../../services/abis/erc20";
import erc721Abi from "../../services/abis/erc721";
import AppStore from "../../store/App.store";

interface CompetitionByIdProps {
  competition: Competition;
  memes: CompetitionMeme[];
}

const MemeById: React.FC<CompetitionByIdProps> = observer(
  ({ competition, memes }) => {
    const {
      query: { id },
    } = useRouter();

    const store = useMemo(
      () =>
        new CompetitionByIdStore(
          parseInt(id as string),
          competition,
          memes ? memes : []
        ),
      [id, competition, memes]
    );

    useEffect(() => {
      store.init();
      return () => {
        store.destroy();
      };
    }, []);
    return (
      <AppLayout>
        <div className={css("mt-4", "flex", "flex-col", "gap-2")}>
          <CompetitionDetails store={store} />
          <div
            className={css("grid", {
              "grid-cols-1": store.showSubmitPane || store.showHasEntriesPane,
              "md:grid-cols-2":
                store.showSubmitPane || store.showHasEntriesPane,
              "gap-2": store.showSubmitPane || store.showHasEntriesPane,
            })}
          >
            <div className={css("order-2", "md:order-1")}>
              <CompetitionSubmissions store={store} />
            </div>
            <div
              className={css(
                "flex",
                "flex-col",
                "gap-2",
                "order-1",
                "md:order-2"
              )}
            >
              {store.showSubmitPane && (
                <Pane
                  type={PaneType.Secondary}
                  title={"Enter"}
                  isExpanded={store.showSubmitContent}
                  onChange={(value) => (store.showSubmitContent = value)}
                >
                  <div className={css("flex", "flex-col", "gap-2")}>
                    <div
                      className={css(
                        "flex",
                        "justify-between",
                        "align-items-center",
                        "gap-2"
                      )}
                    >
                      <Input
                        block
                        value={store.searchValue}
                        onChange={store.onSearchChange}
                        placeholder={"search your catalogue"}
                        type={"text"}
                      />
                      <Button
                        onClick={() => store.onSubmit()}
                        isLoading={store.isSubmitLoading}
                        disabled={!store.canSubmit}
                      >
                        Submit
                      </Button>
                    </div>
                    <MemeSelector store={store} />
                    <SelectedMemesForSubmission store={store} />
                  </div>
                </Pane>
              )}

              {store.showHasEntriesPane && (
                <Pane
                  type={PaneType.Secondary}
                  title={`Your Entries: (${store.userEntriesCount})`}
                  isExpanded={store.showUserEntriesContent}
                  onChange={(value) => (store.showUserEntriesContent = value)}
                >
                  <UserSubmissions store={store} />
                </Pane>
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
);

const CompetitionDetails: React.FC<{ store: CompetitionByIdStore }> = observer(
  ({ store }) => {
    return (
      <>
        <Pane
          type={PaneType.Secondary}
          title={store.competition.name}
          onChange={(val) => (store.showDetails = val)}
          isExpanded={store.showDetails}
        >
          <div className={css("flex", "flex-col", "gap-4", "flex-wrap")}>
            {store.competition.description && (
              <div>
                <Text size={TextSize.sm}>{store.competition.description}</Text>
              </div>
            )}
            <div
              className={css(
                "flex",
                "justify-between",
                "items-end",
                "flex-wrap"
              )}
            >
              <div className={css("flex", "gap-1", "items-center")}>
                <Text size={TextSize.sm} bold>
                  Votes:
                </Text>
                <Text size={TextSize.sm}>{store.totalVotes}</Text>
              </div>
              <div className={css("flex", "gap-1", "items-center")}>
                <Text size={TextSize.sm} bold>
                  Submissions:
                </Text>
                <Text size={TextSize.sm}>{store.memes.length}</Text>
              </div>
              <div className={css("flex", "gap-1", "items-center")}>
                <Text size={TextSize.sm} bold>
                  Max Entries:
                </Text>
                <Text size={TextSize.sm}>
                  {store.competition.maxUserSubmissions}
                </Text>
              </div>
              <div className={css("flex", "gap-1", "items-center")}>
                <Text size={TextSize.sm} bold>
                  Ends at:
                </Text>
                <Text size={TextSize.sm}>
                  {format(new Date(store.competition.endsAt), "Pp")}
                </Text>
              </div>
              <div className={css("flex", "gap-1", "items-center")}>
                <Text size={TextSize.sm} bold>
                  Created by:
                </Text>
                <Link
                  type={LinkType.Secondary}
                  href={`/profile/${store.competition.user.address}/competition`}
                >
                  {abbreviate(store.competition.user.address)}
                </Link>
              </div>
            </div>
            <div className={css("text-right")}>
              <div
                className={css(
                  "rounded-full",
                  "border-[1px]",
                  "px-2",
                  "py-1",
                  "inline-flex",
                  "items-center",
                  "border-black",
                  "dark:border-neutral-700",
                  {
                    "bg-red-800 text-white": !store.competition.isActive,
                    "text-black": store.competition.isActive,
                  }
                )}
              >
                <Text size={TextSize.xs} type={TextType.NoColor}>
                  {store.competition.isActive ? "active" : "ended"}
                </Text>
              </div>
            </div>
          </div>
        </Pane>
        <Pane
          title={`Rewards: (${store.rewards.length})`}
          type={PaneType.Secondary}
          isExpanded={store.showRewards}
          onChange={(val) => (store.showRewards = val)}
        >
          {store.hasRewards && (
            <div className={css("flex", "flex-col", "gap-1")}>
              {store.rewards.map((reward) => (
                <RewardItem
                  key={`reward-${reward.id}`}
                  reward={reward}
                  store={store}
                />
              ))}
            </div>
          )}
          {!store.hasRewards && (
            <div
              className={css(
                "text-gray-600",
                "dark:text-neutral-500",
                "text-xs",
                "text-center",
                "py-4"
              )}
            >
              <Text size={TextSize.sm} type={TextType.Grey}>
                No rewards
              </Text>
            </div>
          )}
        </Pane>
      </>
    );
  }
);

const RewardItem: React.FC<{ reward: Reward; store: CompetitionByIdStore }> =
  observer(({ reward, store }) => {
    const isNft = [TokenType.ERC721, TokenType.ERC1155].includes(
      reward.currency.type
    );
    return (
      <div className={css("flex", "gap-2", "items-center")}>
        <div className={css("flex", "items-center", "gap-4")}>
          <Link
            href={
              isNft
                ? getEtherscanURL(reward.currency.contractAddress, "token")
                : getEtherscanURL(reward.currency.contractAddress, "token")
            }
            isExternal
          />
          <Text size={TextSize.sm}>{reward.competitionRank}</Text>
          <Text size={TextSize.sm}>
            {reward.currency.name ? reward.currency.name : "no name found"} (
            {ethers.utils.formatUnits(
              reward.currencyAmountAtoms,
              reward.currency.decimals
            )}
            )
          </Text>
        </div>
        <div className={css("grow")}></div>
        {store.isCreator && <DistributeReward reward={reward} store={store} />}
        {!store.isCreator && !reward.txId && (
          <Text size={TextSize.xs} type={TextType.Grey}>
            waiting on distribution
          </Text>
        )}
        {!store.isCreator && reward.txId && (
          <Text size={TextSize.xs}>{reward.txId}</Text>
        )}
      </div>
    );
  });

const DistributeReward = observer(
  ({ reward, store }: { reward: Reward; store: CompetitionByIdStore }) => {
    const tokenTypeToContract = {
      [TokenType.ERC1155]: {
        abi: erc1155Abi,
        method: "safeTransferFrom",
        args: [
          AppStore.auth.address,
          store.memes[0].user.address,
          reward.currencyTokenId,
          ethers.utils.formatUnits(
            reward.currencyAmountAtoms,
            reward.currency.decimals
          ),
          "",
        ],
      },
      [TokenType.ERC721]: {
        abi: erc721Abi,
        method: "safeTransferFrom",
        args: [],
      },
      [TokenType.ERC20]: {
        abi: erc20Abi,
        method: "transfer",
        args: [],
      },
    };

    const contractInfo = tokenTypeToContract[reward.currency.type];
    const { config, error } = usePrepareContractWrite({
      address: reward.currency.contractAddress as Address,
      abi: contractInfo.abi,
      functionName: contractInfo.method,
      args: contractInfo.args,
    });
    console.log(contractInfo.args);
    console.log(config, error);
    const { write } = useContractWrite(config);
    return (
      <div>
        {!reward.txId && (
          <div>
            {error && jsonify(error)} {!error && <Button>Distribute</Button>}
          </div>
        )}
        {reward.txId && <div>{reward.txId}</div>}
      </div>
    );
  }
);

export const getServerSideProps: GetServerSideProps<
  CompetitionByIdProps
> = async (context) => {
  const { id } = context.query;
  try {
    const { data: competition } = await http.get<Competition>(
      `/competition/${id}`
    );
    const { data: memes } = await http.get<CompetitionMeme[]>(
      `/competition/${id}/meme/ranked`
    );
    return {
      props: {
        competition,
        memes,
      },
    };
  } catch (e) {
    return redirectTo404();
  }
};

export default MemeById;
