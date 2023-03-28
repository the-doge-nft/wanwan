import {
  darkTheme,
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
import {
  DESCRIPTION,
  getBaseUrl,
  SOCIAL_CARD_URL,
  TITLE,
  TWITTER_USERNAME,
} from "../environment/vars";
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
  useEffect(() => {
    // @next -- generalize this behavior
    if (router.query?.showSettingsModal) {
      AppStore.modals.isSettingsModalOpen = true;
    }
  }, [router.query]);
  const lightRainbowTheme = lightTheme({
    borderRadius: "none",
    fontStack: "system",
    accentColor: colors.red[800],
  });
  const darkRainbowTheme = darkTheme({
    borderRadius: "none",
    fontStack: "system",
    accentColor: colors.red[800],
  });
  lightRainbowTheme.colors.closeButtonBackground = colors.slate[100];
  lightRainbowTheme.colors.modalBackground = colors.slate[100];
  lightRainbowTheme.colors.actionButtonBorder = colors.slate[100];
  lightRainbowTheme.colors.actionButtonBorder = "transparent";
  lightRainbowTheme.fonts.body = "arial, helvetica, clean, sans-serif";
  useEffect(logIt, []);
  useEffect(() => {
    AppStore.init();
    return () => {
      AppStore.destroy();
    };
  }, []);
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
  return (
    <>
      <Head>
        <title>{env.app.name}</title>
        <meta name="description" content={DESCRIPTION} key="desc" />
        <meta property="og:site_name" content={TITLE} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={SOCIAL_CARD_URL} />
        <meta property="og:url" content={getBaseUrl()} />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={SOCIAL_CARD_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={TWITTER_USERNAME} />
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
            theme={
              AppStore.settings.colorMode === "dark"
                ? darkRainbowTheme
                : lightRainbowTheme
            }
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
      AppStore.auth.address !== address &&
      AppStore.auth.hasLoggedIn
    ) {
      AppStore.auth.onAccountSwitch();
    }
  }, [address, disconnect]);

  useEffect(() => {
    if (
      AppStore.auth.status === "authenticated" &&
      !AppStore.auth.hasLoggedIn &&
      address
    ) {
      AppStore.auth.onLoginSuccess(address);
    }
  }, [address, AppStore.auth.hasLoggedIn, AppStore.auth.status]);
  return <></>;
});

export default App;
