import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useEffect, useMemo } from "react";
import CompetitionSubmissions from "../../components/CompetitionById/CompetitionSubmissions";
import CompetitionUserSubmissions from "../../components/CompetitionById/CompetitionUserSubmissions";
import {
  CollapsablePane,
  PaneType,
  expandPane,
} from "../../components/DSL/Pane/Pane";
import { css } from "../../helpers/css";
import {
  Competition,
  CompetitionMeme,
  CompetitionVotingRule,
  CurrencyType,
} from "../../interfaces";
import AppLayout from "../../layouts/App.layout";
import Http from "../../services/http";
import redirectTo404 from "../../services/redirect/404";
import { default as CompetitionByIdStore } from "../../store/CompetitionById/CompetitionById.store";

import Head from "next/head";
import CompetitionRewards from "../../components/CompetitionById/CompetitionRewards";
import CompetitionStats from "../../components/CompetitionById/CompetitionStats";
import CompetitionSubmit from "../../components/CompetitionById/CompetitionSubmit";
import CurateModal from "../../components/CompetitionById/CurateModal";
import Link from "../../components/DSL/Link/Link";
import Text, { TextType } from "../../components/DSL/Text/Text";
import CreateMemeModal from "../../components/Modals/CreateMemeModal";
import InvalidVoteReasonModal from "../../components/Modals/InvalidVoteReasonModal";
import TipTapEditor from "../../components/TipTapEditor/TipTapEditor";
import {
  SOCIAL_CARD_URL,
  TWITTER_USERNAME,
  getBaseUrl,
} from "../../environment/vars";
import { abbreviate, getEtherscanURL } from "../../helpers/strings";

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

    const title = competition.name
      ? `Competition ${competition.name} on wanwan.me`
      : "Checkout this meme competition on wanwan.me";
    const socialCardUrl = competition.coverMedia
      ? competition.coverMedia.url
      : SOCIAL_CARD_URL;
    let url = getBaseUrl() + `/competition/` + competition.id;
    const description = "Wanwan meme competition";
    return (
      <>
        <Head>
          <title>Competition - wanwan</title>
          <meta name="description" content={description} key="desc" />
          <meta property="og:site_name" content={title} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={socialCardUrl} />
          <meta property="og:url" content={url} />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={socialCardUrl} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content={TWITTER_USERNAME} />
        </Head>
        <AppLayout>
          <div className={css("flex", "flex-col", "gap-2")}>
            <CollapsablePane
              {...expandPane(store.showPaneStore, "title")}
              title={store.competition.name}
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
              type={PaneType.Red}
              title={"Stats"}
              {...expandPane(store.showPaneStore, "details")}
            >
              <CompetitionStats store={store} />
            </CollapsablePane>
            {store.hasVoters && (
              <CollapsablePane
                type={PaneType.Red}
                title={"Voters"}
                {...expandPane(store.showPaneStore, "voters")}
              >
                {store.competition.votingRule.map((rule) => (
                  <VotingRuleItem
                    key={`voting-rule-${rule.currency.contractAddress}`}
                    rule={rule}
                  />
                ))}
              </CollapsablePane>
            )}
            <CollapsablePane
              title={`Rewards`}
              type={PaneType.Red}
              {...expandPane(store.showPaneStore, "rewards")}
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
                    type={PaneType.Grey}
                    title={"Enter Competition"}
                    {...expandPane(store.showPaneStore, "submitContent")}
                  >
                    <CompetitionSubmit store={store} />
                  </CollapsablePane>
                )}
                {store.showHasEntriesPane && (
                  <CollapsablePane
                    type={PaneType.Grey}
                    title={`Your Entries: (${store.userEntriesCount})`}
                    {...expandPane(store.showPaneStore, "userEntries")}
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
          {store.isInvalidVoteRuleModalOpen && (
            <InvalidVoteReasonModal
              reason={store.invalidVoteReason}
              isOpen={store.isInvalidVoteRuleModalOpen}
              onChange={(isOpen) => (store.isInvalidVoteRuleModalOpen = isOpen)}
            />
          )}
          {store.isSubmitMemeModalOpen && (
            <CreateMemeModal
              isOpen={store.isSubmitMemeModalOpen}
              onChange={(isOpen) => (store.isSubmitMemeModalOpen = isOpen)}
              onSuccess={(memes) => store.onMemesCreatedSuccess(memes)}
              max={store.competition.maxUserSubmissions}
            />
          )}
        </AppLayout>
      </>
    );
  }
);

interface VotingRuleItemProps {
  rule: CompetitionVotingRule;
}

const VotingRuleItem = ({ rule }: VotingRuleItemProps) => {
  const type = rule.currency.type;
  let name = rule.currency.name
    ? rule.currency.name
    : abbreviate(rule.currency.contractAddress);
  let url = getEtherscanURL(rule.currency.contractAddress, "token");
  if (type === CurrencyType.ERC1155 || type === CurrencyType.ERC721) {
    url = getEtherscanURL(rule.currency.contractAddress, "token");
  }
  return (
    <div className={css("flex", "items-center", "gap-2")}>
      <Link isExternal href={url} />
      <Text>{name}</Text>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  CompetitionByIdProps
> = async (context) => {
  const { id } = context.query;
  try {
    const [{ data: competition }, { data: memes }] = await Promise.all([
      Http.getCompetition(id as string),
      Http.getCompetitionRankedMemes(id as string),
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
