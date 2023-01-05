import "@rainbow-me/rainbowkit/styles.css";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "../components/Link/Link";
import Pane, { PaneType } from "../components/Pane/Pane";
import { css } from "../helpers/css";
import { Competition, Meme } from "../interfaces";
import AppLayout from "../layouts/App.layout";
import http from "../services/http";

interface HomeProps {
  competitions: Competition[];
  memes: Meme[];
}

const Home: React.FC<HomeProps> = ({ competitions, memes }) => {
  return (
    <AppLayout>
      <Head>
        <title>mank</title>
        <meta name="description" content="whatever" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={css()}>
        <div className={css("flex", "flex-col", "gap-4")}>
          <Pane title={"Competitions"}>
            <div className={css("flex", "flex-col", "gap-4")}>
              {competitions.map((comp) => (
                <CompetitionLink key={`competition-${comp.id}`} {...comp} />
              ))}
            </div>
          </Pane>
          <Pane title={"Recent"} type={PaneType.Secondary}>
            <div className={css("flex", "flex-col", "gap-4")}>
              {memes.map((item) => (
                <MemeLink key={`meme-${item.id}`} {...item} />
              ))}
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
      <div className={css("break-words", "text-xs")}>
        {JSON.stringify(meme)}
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
