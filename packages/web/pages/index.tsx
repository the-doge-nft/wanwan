import "@rainbow-me/rainbowkit/styles.css";
import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useCallback, useEffect, useMemo } from "react";
import AsyncWrap from "../components/DSL/AsyncWrap/AsyncWrap";
import Pane, { PaneType } from "../components/DSL/Pane/Pane";
import { colors } from "../components/DSL/Theme";
import PreviewLink from "../components/PreviewLink/PreviewLink";
import env from "../environment";
import { css } from "../helpers/css";
import { Competition, Meme } from "../interfaces";
import AppLayout from "../layouts/App.layout";
import http from "../services/http";
import HomeStore from "../store/Home.store";

interface HomeProps {
  competitions: Competition[];
  memes: Meme[];
}

const Home: React.FC<HomeProps> = observer(({ memes, competitions }) => {
  const store = useMemo(
    () => new HomeStore(memes, competitions),
    [memes, competitions]
  );

  useEffect(() => {
    store.init();
    return () => {
      store.destroy();
    };
  }, []);

  const renderNoDataFound = useCallback(
    (whatWasNotFound: string) => (
      <div className={css("text-xs", "py-8", "text-center", "text-slate-500")}>
        No {whatWasNotFound}
      </div>
    ),
    []
  );
  return (
    <AppLayout>
      <Head>
        <title>{env.app.name}</title>
        <meta name="description" content="whatever" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={css()}>
        <div className={css("flex", "flex-col", "gap-4")}>
          <Pane title={"competitions"}>
            <div
              className={css("grid", "grid-rows-[min-content]", "gap-4", "p-2")}
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              }}
            >
              <AsyncWrap
                isLoading={false}
                hasData={store.competitions.length > 0}
                renderNoData={() => renderNoDataFound("competitions")}
              >
                {store.competitions.map((comp) => (
                  <PreviewLink
                    key={`competition-${comp.id}`}
                    name={comp.name}
                    description={comp.description}
                    link={`/competition/${comp.id}`}
                    ratio={"1/1"}
                    background={colors.slate[200]}
                  />
                ))}
              </AsyncWrap>
            </div>
          </Pane>
          <Pane title={"recent memes"} type={PaneType.Secondary}>
            <div
              className={css("grid", "grid-rows-[min-content]", "gap-4", "p-2")}
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              }}
            >
              <AsyncWrap
                isLoading={false}
                hasData={store.memes.length > 0}
                renderNoData={() => renderNoDataFound("memes")}
              >
                {store.memes.map((meme) => (
                  <PreviewLink
                    key={`meme-${meme.id}`}
                    name={meme.name}
                    description={meme.description}
                    link={`/meme/${meme.id}`}
                    ratio={`${meme.media.width}/${meme.media.height}`}
                    backgroundImage={`url(${meme.media.url})`}
                  />
                ))}
              </AsyncWrap>
            </div>
          </Pane>
        </div>
      </main>
    </AppLayout>
  );
});

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  try {
    const { data: competitions } = await http.get<Competition[]>(
      "/competition"
    );
    const { data: memes } = await http.get<Meme[]>("/meme");
    return { props: { competitions, memes } };
  } catch (e) {
    return { props: { competitions: [], memes: [] } };
  }
};

export default Home;
