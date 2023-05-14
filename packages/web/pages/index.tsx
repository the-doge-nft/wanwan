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
import SearchBar from "../components/SearchBar/SearchBar";
import env from "../environment";
import { css } from "../helpers/css";
import { Competition, Meme, SearchParams, Stats } from "../interfaces";
import AppLayout from "../layouts/App.layout";
import Http from "../services/http";
import redirectTo404 from "../services/redirect/404";
import HomeStore from "../store/Home.store";

interface HomeProps {
  stats: Stats;
  memes: Meme[];
  competitions: Competition[];
  searchParams: SearchParams;
}

const Home: React.FC<HomeProps> = observer(
  ({ stats, memes, competitions, searchParams }) => {
    const store = useMemo(
      () => new HomeStore(memes, competitions, stats, searchParams),
      [memes, competitions, stats, searchParams]
    );

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
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={css()}>
          <div className={css("flex", "flex-col", "gap-4")}>
            <Pane type={PaneType.Grey} title={<SearchBar />} />
            <Pane
              title={"Competitions"}
              rightOfTitle={<ViewAllLink href={"/competitions"} />}
            >
              <AsyncGrid
                isLoading={false}
                data={competitions}
                noDataLabel={"No competitions found"}
              >
                {competitions.map((comp) => (
                  <CompetitionPreviewLink
                    key={`competition-preview-${comp.id}`}
                    competition={comp}
                  />
                ))}
              </AsyncGrid>
            </Pane>
            <Pane
              title={"Recent Memes"}
              rightOfTitle={<ViewAllLink href={"/memes"} />}
            >
              <AsyncGrid
                isLoading={false}
                data={memes}
                noDataLabel={"No memes found"}
              >
                {memes.map((meme) => (
                  <MemePreviewLink
                    key={`meme-preview-${meme.id}`}
                    meme={meme}
                  />
                ))}
              </AsyncGrid>
            </Pane>
            <Pane title={"Stats"} type={PaneType.Red}>
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
                <Stat label={"Users"}>{store.stats.totalUsers}</Stat>
                <Stat label={"Memes"}>{store.stats.totalMemes}</Stat>
                <Stat label={"Competitions"}>
                  {store.stats.totalCompetitions}
                </Stat>
                <Stat label={"Active Competitions"}>
                  {store.stats.totalActiveCompetitions}
                </Stat>
              </div>
            </Pane>
          </div>
        </main>
      </AppLayout>
    );
  }
);

const ViewAllLink = ({ href }: { href: string }) => {
  return (
    <Link type={LinkType.Secondary} href={href}>
      <span
        className={css(
          "text-slate-400",
          "hover:text-slate-700",
          "dark:hover:text-slate-400",
          "dark:text-slate-700"
        )}
      >
        <TfiLayoutGrid2Alt size={18} />
      </span>
    </Link>
  );
};

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
  const params: SearchParams = {
    count: 8,
    offset: 0,
    sorts: [{ key: "createdAt", direction: "desc" }],
    filters: [],
  };
  try {
    const [
      {
        data: { data: competitions },
      },
      {
        data: { data: memes },
      },
      { data: stats },
    ] = await Promise.all([
      Http.searchCompetition(params),
      Http.searchMeme(params),
      Http.stats(),
    ]);

    return {
      props: { competitions, memes, stats, searchParams: params },
    };
  } catch (e) {
    return redirectTo404();
  }
};

export default Home;
