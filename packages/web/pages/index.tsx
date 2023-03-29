import "@rainbow-me/rainbowkit/styles.css";
import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { PropsWithChildren, useEffect, useMemo } from "react";
import ActivePill from "../components/ActivePill/ActivePill";
import AspectRatio from "../components/DSL/AspectRatio/AspectRatio";
import AsyncGrid from "../components/DSL/AsyncGrid/AsyncGrid";
import Link, { LinkType } from "../components/DSL/Link/Link";
import Pane, { PaneType } from "../components/DSL/Pane/Pane";
import Text, { TextSize, TextType } from "../components/DSL/Text/Text";
import PreviewLink from "../components/PreviewLink/PreviewLink";
import env from "../environment";
import { css } from "../helpers/css";
import { Competition, Meme, SearchParams, Stats } from "../interfaces";
import AppLayout from "../layouts/App.layout";
import Http from "../services/http";
import redirectTo404 from "../services/redirect/404";
import HomeStore from "../store/Home.store";

interface HomeProps {
  competitions: Competition[];
  memes: Meme[];
  stats: Stats;
  searchParams: SearchParams;
}

const Home: React.FC<HomeProps> = observer(
  ({ memes, competitions, stats, searchParams }) => {
    const store = useMemo(
      () => new HomeStore(memes, competitions, searchParams),
      [memes, competitions, searchParams]
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
                  <div
                    key={`competition-preview-${comp.id}`}
                    className={css("relative")}
                  >
                    <PreviewLink
                      name={comp.name}
                      href={`/competition/${comp.id}`}
                    >
                      <AspectRatio
                        className={css(
                          "bg-cover",
                          "bg-center",
                          "bg-no-repeat",
                          "h-full"
                        )}
                        ratio={
                          comp?.media
                            ? `${comp.media.width}/${comp.media.height}`
                            : "1/1"
                        }
                        style={
                          comp.media
                            ? { backgroundImage: `url(${comp.media.url})` }
                            : {}
                        }
                      >
                        {comp.isActive && (
                          <div
                            className={css(
                              "flex",
                              "items-end",
                              "justify-end",
                              "p-1"
                            )}
                          >
                            <ActivePill />
                          </div>
                        )}
                      </AspectRatio>
                    </PreviewLink>
                  </div>
                ))}
              </AsyncGrid>
            </Pane>
            <Pane
              title={"Recent Memes"}
              rightOfTitle={
                <Link type={LinkType.Secondary} href={"/memes"}>
                  <Text size={TextSize.xs} type={TextType.NoColor}>
                    All
                  </Text>
                </Link>
              }
            >
              <AsyncGrid
                isLoading={store.isMemesLoading}
                data={store.memes}
                noDataLabel={"No memes found"}
              >
                {store.memes.map((meme) => (
                  <div key={`meme-preview-${meme.id}`}>
                    <PreviewLink href={`/meme/${meme.id}`}>
                      <AspectRatio
                        className={css(
                          "bg-cover",
                          "bg-center",
                          "bg-no-repeat",
                          "h-full"
                        )}
                        ratio={`${meme.media.width}/${meme.media.height}`}
                        style={{ backgroundImage: `url(${meme.media.url})` }}
                      />
                    </PreviewLink>
                  </div>
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
  }
);

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
    count: 12,
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
