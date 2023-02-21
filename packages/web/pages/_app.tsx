import {
  lightTheme,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { observer } from "mobx-react-lite";
import type { AppProps } from "next/app";
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

const App = observer(({ Component, pageProps }: AppProps) => {
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
  return (
    <>
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
  return <></>;
});

export default App;
