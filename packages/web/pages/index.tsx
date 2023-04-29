import "@rainbow-me/rainbowkit/styles.css";
import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { TfiLayoutGrid2Alt } from "react-icons/tfi";
import AsyncGrid from "../components/DSL/AsyncGrid/AsyncGrid";
import Link, { LinkType } from "../components/DSL/Link/Link";
import Pane, { PaneType } from "../components/DSL/Pane/Pane";
import Text, { TextSize } from "../components/DSL/Text/Text";
import CompetitionPreviewLink from "../components/PreviewLink/CompetitionPreviewLink";
import MemePreviewLink from "../components/PreviewLink/MemePreviewLink";
import env from "../environment";
import { css } from "../helpers/css";
import { Stats } from "../interfaces";
import AppLayout from "../layouts/App.layout";
import Http from "../services/http";
import redirectTo404 from "../services/redirect/404";
import HomeStore from "../store/Home.store";

interface HomeProps {
  stats: Stats;
}

const Home: React.FC<HomeProps> = observer(({ stats }) => {
  const store = useMemo(() => new HomeStore(), []);

  useEffect(() => {
    store.init();
    return () => {
      store.destroy();
    };
  }, []);

  return (
    <AppLayout>
      <Head>
        <title>{env.app.name}</title>
        <meta name="description" content="whatever" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={css()}>
        <div className={css("flex", "flex-col", "gap-4")}>
          <Pane title={"What is wanwan?"} type={PaneType.Secondary}>
            <Text size={TextSize.sm}>
              wanwan is a platform for meme competitions. Add memes to your
              profile & submit them to competitions to win prizes.
            </Text>
          </Pane>
          <Pane title={"Competitions"}>
            <AsyncGrid
              isLoading={store.isCompetitionsLoading}
              data={store.competitions}
              noDataLabel={"No competitions found"}
            >
              {store.competitions.map((comp) => (
                <CompetitionPreviewLink
                  key={`competition-preview-${comp.id}`}
                  competition={comp}
                />
              ))}
            </AsyncGrid>
          </Pane>
          <Pane
            title={"Recent Memes"}
            rightOfTitle={
              <Link type={LinkType.Secondary} href={"/memes"}>
                <TfiLayoutGrid2Alt size={18} />
              </Link>
            }
          >
            <AsyncGrid
              isLoading={store.isMemesLoading}
              data={store.memes}
              noDataLabel={"No memes found"}
            >
              {store.memes.map((meme) => (
                <MemePreviewLink key={`meme-preview-${meme.id}`} meme={meme} />
              ))}
            </AsyncGrid>
          </Pane>
          <Pane title={"Stats"}>
            <div
              className={css(
                "text-xs",
                "grid",
                "grid-rows-4",
                "grid-cols-1",
                "sm:grid-rows-2",
                "sm:grid-cols-2",
                "md:grid-rows-1",
                "md:grid-cols-4"
              )}
            >
              <Stat label={"Users"}>{stats.totalUsers}</Stat>
              <Stat label={"Memes"}>{stats.totalMemes}</Stat>
              <Stat label={"Competitions"}>{stats.totalCompetitions}</Stat>
              <Stat label={"Active Competitions"}>
                {stats.totalActiveCompetitions}
              </Stat>
            </div>
          </Pane>
        </div>
      </main>
    </AppLayout>
  );
});

interface StatProps {
  label: string;
}

const Stat: React.FC<PropsWithChildren<StatProps>> = ({ label, children }) => {
  return (
    <div className={css("inline-flex", "gap-1", "items-center")}>
      <Text size={TextSize.sm}>{label}:</Text>
      <Text bold size={TextSize.sm}>
        {children}
      </Text>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  try {
    const { data: stats } = await Http.stats();
    return {
      props: { stats },
    };
  } catch (e) {
    return redirectTo404();
  }
};

export default Home;
