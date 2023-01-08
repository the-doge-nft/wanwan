import "@rainbow-me/rainbowkit/styles.css";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useCallback } from "react";
import AsyncWrap from "../components/dsl/AsyncWrap/AsyncWrap";
import Link from "../components/dsl/Link/Link";
import Pane, { PaneType } from "../components/dsl/Pane/Pane";
import MemeLink from "../components/MemeLink/MemeLink";
import env from "../environment";
import { css } from "../helpers/css";
import { Competition, Meme } from "../interfaces";
import AppLayout from "../layouts/App.layout";
import http from "../services/http";

interface HomeProps {
  competitions: Competition[];
  memes: Meme[];
}

const Home: React.FC<HomeProps> = ({ competitions, memes }) => {
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
            <div className={css("flex", "flex-col", "gap-4")}>
              <AsyncWrap
                isLoading={false}
                hasData={competitions.length > 0}
                renderNoData={() => renderNoDataFound("competitions")}
              >
                {competitions.map((comp) => (
                  <CompetitionLink key={`competition-${comp.id}`} {...comp} />
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
                hasData={memes.length > 0}
                renderNoData={() => renderNoDataFound("memes")}
              >
                {memes.map((meme) => (
                  <MemeLink key={`meme-${meme.id}`} {...meme} />
                ))}
              </AsyncWrap>
            </div>
          </Pane>
        </div>
      </main>
    </AppLayout>
  );
};

const CompetitionLink: React.FC<Competition> = ({ ...competition }) => {
  return (
    <Link href={`/competition/${competition.id}`}>
      <div className={css("break-words", "max-w-full")}>
        <div>{competition.name}</div>
        <div className={css("text-xs", "break-words")}>
          {JSON.stringify(competition)}
        </div>
      </div>
    </Link>
  );
};

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
