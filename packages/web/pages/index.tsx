import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import Head from "next/head";
import { ConnectButton } from "../components/Button/Button";
import { css } from "../helpers/css";
import AppLayout from "../layouts/App.layout";

export default function Home() {
  // const session = useSession();
  const { openChainModal } = useChainModal();
  const { openAccountModal } = useAccountModal();
  const { openConnectModal } = useConnectModal();
  return (
    <AppLayout>
      <Head>
        <title>Meme2Earn</title>
        <meta name="description" content="Meme2Earn" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={css("bg-gray-300")}>
        <div className={css("text-center")}>meme2earn</div>
        <div className={css("flex", "justify-center", "items-center", "mt-8")}>
          <ConnectButton>Connect</ConnectButton>
        </div>
        {/* <div className={css("flex", "flex-col", "gap-4")}>
          <Button onClick={openChainModal}>open chain modal</Button>
          <Button onClick={openAccountModal}>open account modal</Button>
          <Button onClick={openConnectModal}>open connect modal</Button>
        </div> */}
      </main>
    </AppLayout>
  );
}
