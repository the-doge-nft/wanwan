import {
  lightTheme,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { observer } from "mobx-react-lite";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useDisconnect, WagmiConfig } from "wagmi";
import { colors } from "../components/DSL/Theme";
import { toastTransition } from "../components/DSL/Toast/Toast";
import Modals from "../components/Modals/Modals";
import env from "../environment";
import { chains, client, createRainbowAuthAdapter } from "../services/wagmi";
import AppStore from "../store/App.store";
import "../styles/globals.css";

NProgress.configure({ showSpinner: false });

const logIt = () => {
  console.log(
    `%c
   ________   _______     _______      ________   _______     _______ 
  ╱  ╱  ╱  ╲ ╱       ╲╲ ╱╱   ╱   ╲    ╱  ╱  ╱  ╲ ╱       ╲╲ ╱╱   ╱   ╲
 ╱         ╱╱        ╱╱╱╱        ╱   ╱         ╱╱        ╱╱╱╱        ╱
╱╱        ╱╱         ╱╱         ╱   ╱╱        ╱╱         ╱╱         ╱ 
╲╲_______╱ ╲___╱____╱ ╲__╱_____╱    ╲╲_______╱ ╲___╱____╱ ╲__╱_____╱                                                 
`,
    `font-family: monospace`
  );
};

const App = observer(({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const theme = lightTheme({
    borderRadius: "none",
    fontStack: "system",
    accentColor: colors.gray[500],
  });
  theme.colors.closeButtonBackground = colors.slate[100];
  theme.colors.modalBackground = colors.slate[100];
  theme.colors.actionButtonBorder = colors.slate[100];
  theme.colors.actionButtonBorder = "transparent";
  useEffect(() => {
    AppStore.init();
    return () => {
      AppStore.destroy();
    };
  }, []);
  useEffect(logIt, []);
  useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    return () => {
      // Make sure to remove the event handler on unmount!
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
  }, []);
  const description = "Run competitions, create memes, win prizes";
  const title = "wanwan";
  const url = "https://wanwan.me";
  const twitterUsername = "@ownthedoge";
  const socialCardUrl = "https://wanwan.me/images/twitter-card.png";
  return (
    <>
      <Head>
        <title>{env.app.name}</title>
        <meta name="description" content={description} key="desc" />
        <meta property="og:site_name" content={title} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={socialCardUrl} />
        <meta property="og:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={socialCardUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={twitterUsername} />
      </Head>
      <WagmiConfig client={client}>
        <RainbowKitAuthenticationProvider
          status={AppStore.auth.status}
          adapter={createRainbowAuthAdapter({
            onVerifySuccess: (address) => AppStore.auth.onLoginSuccess(address),
            onLogoutSuccess: () => AppStore.auth.onLogoutSuccess(),
          })}
        >
          <RainbowKitProvider
            appInfo={{
              appName: env.app.name,
            }}
            chains={chains}
            theme={theme}
          >
            <Component {...pageProps} />
            <Modals />
            <WagmiAccountSwitchWatcher />
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </WagmiConfig>
      <ToastContainer
        position={"bottom-right"}
        autoClose={3500}
        hideProgressBar
        transition={toastTransition}
      />
    </>
  );
});

const WagmiAccountSwitchWatcher = observer(() => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  useEffect(() => {
    if (
      AppStore.auth.address !== undefined &&
      AppStore.auth.address !== address
    ) {
      AppStore.auth.onAccountSwitch();
    }
  }, [address, disconnect]);

  useEffect(() => {
    if (address) {
      AppStore.auth.getStatus({
        onUnauthed: () => {
          disconnect();
        },
        onAuthed: () => {
          AppStore.auth.address = address;
        },
      });
    }
  }, []);
  return <></>;
});

export default App;
