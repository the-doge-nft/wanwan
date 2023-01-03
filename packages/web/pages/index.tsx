import Head from "next/head";
import { ConnectButton } from "../components/Button/Button";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";

export default function Home() {
  return (
    <AppLayout>
      <Head>
        <title>Meme2Earn</title>
        <meta name="description" content="Meme2Earn" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={css("bg-grey-300")}>
        <div className={css("text-center")}>meme2earn</div>
        <ConnectButton>Connect</ConnectButton>
      </main>
    </AppLayout>
  );
}
