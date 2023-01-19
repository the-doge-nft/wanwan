import "@rainbow-me/rainbowkit/styles.css";
import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useMemo } from "react";
import AspectRatio from "../components/DSL/AspectRatio/AspectRatio";
import AsyncWrap, { NoDataFound } from "../components/DSL/AsyncWrap/AsyncWrap";
import Pane, { PaneType } from "../components/DSL/Pane/Pane";
import { colors } from "../components/DSL/Theme";
import PreviewLink from "../components/PreviewLink/PreviewLink";
import env from "../environment";
import { css } from "../helpers/css";
import { encodeBase64 } from "../helpers/strings";
import {
  Competition,
  Meme,
  SearchParams,
  SearchResponse,
  Stats,
} from "../interfaces";
import AppLayout from "../layouts/App.layout";
import http from "../services/http";
import redirectTo404 from "../services/redirect/404";
import HomeStore from "../store/Home.store";

interface HomeProps {
  competitions: Competition[];
  memes: Meme[];
  stats: Stats | null;
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
              wanwan is a platform for creating meme competitions. If you make
              something good enough, you could win.
            </Pane>
            <Pane title={"Competitions"}>
              <div
                className={css("grid", "grid-rows-[min-content]", "gap-4")}
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                }}
              >
                <AsyncWrap
                  isLoading={false}
                  hasData={store.competitions.length > 0}
                  renderNoData={() => <NoDataFound>competitions</NoDataFound>}
                >
                  {store.competitions.map((comp) => (
                    <div key={`competition-preview-${comp.id}`}>
                      <PreviewLink
                        name={comp.name}
                        description={comp.description}
                        link={`/competition/${comp.id}`}
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
                            comp?.media
                              ? { backgroundImage: `url(${comp.media.url})` }
                              : { backgroundColor: colors.slate[200] }
                          }
                        />
                      </PreviewLink>
                    </div>
                  ))}
                </AsyncWrap>
              </div>
            </Pane>
            <Pane title={"Recent"}>
              <div
                className={css("grid", "grid-rows-[min-content]", "gap-4")}
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                }}
              >
                <AsyncWrap
                  isLoading={false}
                  hasData={store.memes.length > 0}
                  renderNoData={() => <NoDataFound>memes</NoDataFound>}
                >
                  {store.memes.map((meme) => (
                    <div key={`meme-preview-${meme.id}`}>
                      <PreviewLink
                        name={meme.name}
                        description={meme.description}
                        link={`/meme/${meme.id}`}
                      >
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
                </AsyncWrap>
              </div>
            </Pane>
            <Pane title={"Stats"}>
              {stats && (
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
                  <div className={css("inline-flex", "gap-1")}>
                    <div className={css("font-bold")}>Users:</div>
                    <div>{stats.totalUsers}</div>
                  </div>
                  <div className={css("inline-flex", "gap-1")}>
                    <div className={css("font-bold")}>Memes:</div>
                    <div>{stats.totalMemes}</div>
                  </div>
                  <div className={css("inline-flex", "gap-1")}>
                    <div className={css("font-bold")}>Competitions:</div>
                    <div>{stats.totalCompetitions}</div>
                  </div>
                  <div className={css("inline-flex", "gap-1")}>
                    <div className={css("font-bold")}>Active Competitions:</div>
                    <div>{stats.totalActiveCompetitions}</div>
                  </div>
                </div>
              )}
            </Pane>
          </div>
        </main>
      </AppLayout>
    );
  }
);

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const params: SearchParams = {
    count: 12,
    offset: 0,
    config: encodeBase64({
      sorts: [{ key: "createdAt", direction: "desc" }],
    }),
  };
  try {
    const {
      data: { data: competitions },
    } = await http.get<SearchResponse<Competition>>("/competition/search", {
      params,
    });

    const {
      data: { data: memes },
    } = await http.get<SearchResponse<Meme>>("/meme/search", {
      params,
    });
    const { data: stats } = await http.get<Stats>("/stats");
    return {
      props: { competitions, memes, stats, searchParams: params },
    };
  } catch (e) {
    return redirectTo404();
  }
};

export default Home;
