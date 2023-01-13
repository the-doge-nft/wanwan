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
import { Competition, Meme } from "../interfaces";
import AppLayout from "../layouts/App.layout";
import http from "../services/http";
import AppStore from "../store/App.store";
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
            wanwan is a platform for creating meme competitions.
          </Pane>
          <Pane title={"Your memes"}>
            <div
              className={css("grid", "grid-rows-[min-content]", "gap-4", "p-2")}
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              }}
            >
              {AppStore.auth.memes.map((meme) => (
                <AspectRatio
                  key={`meme-user-${meme.id}`}
                  className={css(
                    "bg-cover",
                    "bg-center",
                    "bg-no-repeat",
                    "h-full",
                    "max-w-[200px]"
                  )}
                  ratio={`${meme.media.width}/${meme.media.height}`}
                  style={{ backgroundImage: `url(${meme.media.url})` }}
                />
              ))}
            </div>
          </Pane>
          <Pane title={"Competitions"}>
            <div
              className={css("grid", "grid-rows-[min-content]", "gap-4", "p-2")}
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
                  <div
                    key={`competition-preview-${comp.id}`}
                    className={css("max-w-[200px]")}
                  >
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
                        ratio={"1/1"}
                        style={{ background: colors.slate[200] }}
                      />
                    </PreviewLink>
                  </div>
                ))}
              </AsyncWrap>
            </div>
          </Pane>
          <Pane title={"Recent memes"}>
            <div
              className={css("grid", "grid-rows-[min-content]", "gap-4", "p-2")}
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
                  <div
                    key={`meme-preview-${meme.id}`}
                    className={css("max-w-[200px]")}
                  >
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
