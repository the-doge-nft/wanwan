import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useEffect, useMemo } from "react";
import CompetitionSubmissions from "../../components/CompetitionById/CompetitionSubmissions";
import CompetitionUserSubmissions from "../../components/CompetitionById/CompetitionUserSubmissions";
import { CollapsablePane, PaneType } from "../../components/DSL/Pane/Pane";
import { css } from "../../helpers/css";
import { Competition, CompetitionMeme } from "../../interfaces";
import AppLayout from "../../layouts/App.layout";
import Http from "../../services/http";
import redirectTo404 from "../../services/redirect/404";
import { default as CompetitionByIdStore } from "../../store/CompetitionId.store";

import CompetitionDetails from "../../components/CompetitionById/CompetitionDetails";
import CompetitionRewards from "../../components/CompetitionById/CompetitionRewards";
import CompetitionSubmit from "../../components/CompetitionById/CompetitionSubmit";
import CurateModal from "../../components/CompetitionById/CurateModal";

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
        <div className={css("flex", "flex-col", "gap-2")}>
          <CollapsablePane
            type={PaneType.Secondary}
            title={store.competition.name}
            onChange={(val) => (store.showDetails = val)}
            isExpanded={store.showDetails}
          >
            <CompetitionDetails store={store} />
          </CollapsablePane>
          <CollapsablePane
            title={`Rewards: (${store.rewards.length})`}
            type={PaneType.Secondary}
            isExpanded={store.showRewards}
            onChange={(val) => (store.showRewards = val)}
          >
            <CompetitionRewards store={store} />
          </CollapsablePane>
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
                <CollapsablePane
                  type={PaneType.Secondary}
                  title={"Enter Competition"}
                  isExpanded={store.showSubmitContent}
                  onChange={(value) => (store.showSubmitContent = value)}
                >
                  <CompetitionSubmit store={store} />
                </CollapsablePane>
              )}
              {store.showHasEntriesPane && (
                <CollapsablePane
                  type={PaneType.Secondary}
                  title={`Your Entries: (${store.userEntriesCount})`}
                  isExpanded={store.showUserEntriesContent}
                  onChange={(value) => (store.showUserEntriesContent = value)}
                >
                  <CompetitionUserSubmissions store={store} />
                </CollapsablePane>
              )}
            </div>
          </div>
        </div>
        {store.isCurateModalOpen && store.memeToCurate && <CurateModal 
          onConfirm={() => {
            store.runThenRefreshMemes(() => store.hideSubmission()).then(() => store.isCurateModalOpen = false)
          }} 
          onChange={(isOpen) => store.isCurateModalOpen = isOpen} 
          isOpen={store.isCurateModalOpen} 
          competition={store.competition} 
          meme={store.memeToCurate}
        />}
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
