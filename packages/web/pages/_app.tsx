import {
  AuthenticationStatus,
  lightTheme,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { useCallback, useEffect, useState } from "react";
import { WagmiConfig } from "wagmi";
import env from "../environment";
import http from "../services/http";
import { chains, client, createRainbowAuthAdapter } from "../services/wagmi";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const theme = lightTheme({ borderRadius: "none" });
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>("loading");
  const getAuthStatus = useCallback(() => {
    http
      .get("/auth/status")
      .then(({ data: isLoggedIn }) => {
        if (isLoggedIn) {
          setAuthStatus("authenticated");
        } else {
          setAuthStatus("unauthenticated");
        }
      })
      .catch((e) => setAuthStatus("unauthenticated"));
  }, []);
  useEffect(() => {
    getAuthStatus();
  }, []);
  return (
    <WagmiConfig client={client}>
      <RainbowKitAuthenticationProvider
        status={authStatus}
        adapter={createRainbowAuthAdapter({
          onVerifySuccess: () => getAuthStatus(),
          onLogoutSuccess: () => getAuthStatus(),
        })}
      >
        <RainbowKitProvider
          appInfo={{ appName: env.app.name }}
          chains={chains}
          theme={theme}
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}
