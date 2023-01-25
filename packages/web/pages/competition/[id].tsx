import { format } from "date-fns";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import Button from "../../components/DSL/Button/Button";
import Input from "../../components/DSL/Input/Input";
import Link, { LinkType } from "../../components/DSL/Link/Link";
import Pane, { PaneType } from "../../components/DSL/Pane/Pane";
import CompetitionSubmissions from "../../components/MemeSubmission/CompetitionSubmissions";
import MemeSelector from "../../components/MemeSubmission/MemeSelector";
import SelectedMemesForSubmission from "../../components/MemeSubmission/SelectedMemesForSubmission";
import UserSubmissions from "../../components/MemeSubmission/UserSubmissions";
import { css } from "../../helpers/css";
import { abbreviate, jsonify } from "../../helpers/strings";
import { Competition, CompetitionMeme, Reward } from "../../interfaces";
import AppLayout from "../../layouts/App.layout";
import http from "../../services/http";
import redirectTo404 from "../../services/redirect/404";
import { default as CompetitionByIdStore } from "../../store/CompetitionId.store";

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
                  toggle
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
                  toggle
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
      <Pane type={PaneType.Secondary} title={store.competition.name}>
        <div className={css("text-sm")}>
          {store.competition.description && (
            <div>{store.competition.description}</div>
          )}
          <div
            className={css("flex", "justify-between", "items-end", {
              "mt-4": store.competition.description,
            })}
          >
            <div>
              <div className={css("flex", "gap-1", "items-center")}>
                <div className={css("font-bold")}>Votes:</div>
                <div>{store.totalVotes}</div>
              </div>
              <div className={css("flex", "gap-1", "items-center")}>
                <div className={css("font-bold")}>Submissions:</div>
                <div>{store.memes.length}</div>
              </div>
              <div className={css("flex", "gap-1", "items-center")}>
                <div className={css("font-bold")}>Max Entries:</div>
                <div>{store.competition.maxUserSubmissions}</div>
              </div>
              <div className={css("flex", "gap-1", "items-center")}>
                <div className={css("font-bold")}>Ends at:</div>
                <div>{format(new Date(store.competition.endsAt), "Pp")}</div>
              </div>
              <div className={css("mt-2")}>
                <div className={css("font-bold")}>Rewards</div>
                {store.rewards.map((reward) => (
                  <Reward key={`reward-${reward.id}`} reward={reward} />
                ))}
              </div>
            </div>

            <div className={css("flex", "gap-1", "justify-end")}>
              <div>Created by:</div>
              <Link
                type={LinkType.Secondary}
                href={`/profile/${store.competition.user.address}/competition`}
              >
                {abbreviate(store.competition.user.address)}
              </Link>
            </div>
          </div>
        </div>
      </Pane>
    );
  }
);

const Reward: React.FC<{ reward: Reward }> = ({ reward }) => {
  return (
    <div className={css("flex", "gap-2", "items-center")}>
      <Link href={""} isExternal />
      <div>{reward.competitionRank}</div>
      <div>{reward.currency.type}</div>
      {/* <div>{reward.currency.contractAddress}</div> */}
      {/* <div>{reward.currency.name}</div> */}
      <div>{reward.currency.symbol}</div>
      <div>
        {ethers.utils.formatUnits(
          reward.currencyAmountAtoms,
          reward.currency.decimals
        )}
      </div>
      <div>{jsonify(reward)}</div>
    </div>
  );
};

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
