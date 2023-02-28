import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useEffect, useMemo } from "react";
import CompetitionMemeSelector from "../../components/CompetitionById/CompetitionMemeSelector";
import CompetitionSelectedMemesForSubmission from "../../components/CompetitionById/CompetitionSelectedMemeForSubmission";
import CompetitionSubmissions from "../../components/CompetitionById/CompetitionSubmissions";
import CompetitionUserSubmissions from "../../components/CompetitionById/CompetitionUserSubmissions";
import Button from "../../components/DSL/Button/Button";
import Input from "../../components/DSL/Input/Input";
import Pane, { PaneType } from "../../components/DSL/Pane/Pane";
import { css } from "../../helpers/css";
import { Competition, CompetitionMeme } from "../../interfaces";
import AppLayout from "../../layouts/App.layout";
import Http from "../../services/http";
import redirectTo404 from "../../services/redirect/404";
import { default as CompetitionByIdStore } from "../../store/CompetitionId.store";

import CompetitionDetails from "../../components/CompetitionById/CompetitionDetails";
import CompetitionRewards from "../../components/CompetitionById/CompetitionRewards";

interface CompetitionByIdProps {
  competition: Competition;
  memes: CompetitionMeme[];
}

const CompetitionById: React.FC<CompetitionByIdProps> = observer(
  ({ competition, memes }) => {
    const store = useMemo(
      () => new CompetitionByIdStore(competition, memes ? memes : []),
      [competition, memes]
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
          <Pane
            type={PaneType.Secondary}
            title={store.competition.name}
            onChange={(val) => (store.showDetails = val)}
            isExpanded={store.showDetails}
          >
            <CompetitionDetails store={store} />
          </Pane>
          <Pane
            title={`Rewards: (${store.rewards.length})`}
            type={PaneType.Secondary}
            isExpanded={store.showRewards}
            onChange={(val) => (store.showRewards = val)}
          >
            <CompetitionRewards store={store} />
          </Pane>
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
                    <CompetitionMemeSelector store={store} />
                    <CompetitionSelectedMemesForSubmission store={store} />
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
                  <CompetitionUserSubmissions store={store} />
                </Pane>
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
);

export const getServerSideProps: GetServerSideProps<
  CompetitionByIdProps
> = async (context) => {
  const { id } = context.query;
  try {
    const [{ data: competition }, { data: memes }] = await Promise.all([
      Http.getCompetition(id as string),
      Http.getCompetitionMemes(id as string),
    ]);
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

export default CompetitionById;
