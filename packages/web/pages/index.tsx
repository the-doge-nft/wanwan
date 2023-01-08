import "@rainbow-me/rainbowkit/styles.css";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useCallback } from "react";
import AspectRatio from "../components/AspectRatio/AspectRatio";
import AsyncWrap from "../components/AsyncWrap/AsyncWrap";
import Link from "../components/Link/Link";
import Pane, { PaneType } from "../components/Pane/Pane";
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
          <Pane title={"Competitions"}>
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
          <Pane title={"Recent"} type={PaneType.Secondary}>
            <div className={css("flex", "flex-col", "gap-4")}>
              <AsyncWrap
                isLoading={false}
                hasData={memes.length > 0}
                renderNoData={() => renderNoDataFound("memes")}
              >
                {memes.map((item) => (
                  <MemeLink key={`meme-${item.id}`} {...item} />
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
        {/* <div className={css("flex", "justify-between", "items-center")}>
        <div>{competition.description}</div>
        <div className={css("text-xs")}>
          ends at: {new Date(competition.endsAt).toLocaleString()}
        </div>
      </div> */}
        <div className={css("text-xs", "break-words")}>
          {JSON.stringify(competition)}
        </div>
      </div>
    </Link>
  );
};

const MemeLink: React.FC<Meme> = ({ ...meme }) => {
  return (
    <Link href={`/meme/${meme.id}`}>
      <div className={css("flex", "flex-col")}>
        <AspectRatio
          className={css(
            "max-w-[300px]",
            "bg-contain",
            "bg-center",
            "bg-no-repeat"
          )}
          ratio={`${meme.media.width}/${meme.media.height}`}
          style={{
            backgroundImage: `url(${meme.media.url})`,
          }}
        />
        <div className={css("break-words", "text-xs")}>
          {JSON.stringify(meme)}
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
