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

import Image from "next/image";
import CompetitionRewards from "../../components/CompetitionById/CompetitionRewards";
import CompetitionStats from "../../components/CompetitionById/CompetitionStats";
import CompetitionSubmit from "../../components/CompetitionById/CompetitionSubmit";
import CurateModal from "../../components/CompetitionById/CurateModal";
import Text, { TextType } from "../../components/DSL/Text/Text";
import TipTapEditor from "../../components/TipTapEditor/TipTapEditor";

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
            onChange={(value) => (store.showTitle = value)}
            isExpanded={store.showTitle}
            title={
              <div className={css("flex", "items-center", "gap-2")}>
                {store.competition.coverMedia && (
                  <div className={css("relative", "w-[25px]", "h-[25px]")}>
                    <Image
                      fill
                      alt={store.competition.name}
                      src={store.competition.coverMedia.url}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                )}
                <Text>{store.competition.name}</Text>
              </div>
            }
          >
            {store.competition.description && (
              <div className={css("grow")}>
                <TipTapEditor
                  border={false}
                  readonly
                  content={JSON.parse(store.competition.description)}
                />
              </div>
            )}
            {!store.competition.description && (
              <div className={css("text-center", "p-4")}>
                <Text type={TextType.Grey}>No description</Text>
              </div>
            )}
          </CollapsablePane>
          <CollapsablePane
            type={PaneType.Secondary}
            title={"Stats"}
            onChange={(val) => (store.showDetails = val)}
            isExpanded={store.showDetails}
          >
            <CompetitionStats store={store} />
          </CollapsablePane>
          <CollapsablePane
            title={`Rewards`}
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
        {store.isCurateModalOpen && store.memeToCurate && (
          <CurateModal
            onConfirm={() => {
              store
                .runThenRefreshMemes(() => store.hideSubmission())
                .then(() => (store.isCurateModalOpen = false));
            }}
            onChange={(isOpen) => (store.isCurateModalOpen = isOpen)}
            isOpen={store.isCurateModalOpen}
            competition={store.competition}
            meme={store.memeToCurate}
          />
        )}
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
