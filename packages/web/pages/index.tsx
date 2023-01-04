import "@rainbow-me/rainbowkit/styles.css";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";
import http from "../services/http";

interface HomeProps {
  competitions: any[];
}

const Home: React.FC<HomeProps> = ({ competitions }) => {
  return (
    <AppLayout>
      <Head>
        <title>Meme2Earn</title>
        <meta name="description" content="Meme2Earn" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={css()}>
        <div className={css("flex", "justify-center", "items-center")}>
          check it out
        </div>
        <div>{JSON.stringify(competitions)}</div>
      </main>
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const { data: competitions } = await http.get<any[]>("/competition");
  console.log(competitions);
  return { props: { competitions } };
};

export default Home;
