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
import { WagmiConfig } from "wagmi";
import env from "../environment";
import { chains, client, createRainbowAuthAdapter } from "../services/wagmi";
import AppStore from "../store/App.store";
import "../styles/globals.css";

const App = observer(({ Component, pageProps }: AppProps) => {
  const theme = lightTheme({ borderRadius: "none" });
  useEffect(() => {
    AppStore.init();
  }, []);
  return (
    <WagmiConfig client={client}>
      <RainbowKitAuthenticationProvider
        status={AppStore.auth.status}
        adapter={createRainbowAuthAdapter({
          onVerifySuccess: () => AppStore.auth.getStatus(),
          onLogoutSuccess: () => AppStore.auth.getStatus(),
        })}
      >
        <RainbowKitProvider
          appInfo={{ appName: env.app.name }}
          chains={chains}
          theme={theme}
        >
          <Component {...pageProps} />
          <ToastContainer
            position={"bottom-right"}
            autoClose={5000}
            hideProgressBar
          />
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
});

export default App;
// export default function Duh({ Component, pageProps }: AppProps) {
//   const theme = lightTheme({ borderRadius: "none" });
//   useEffect(() => {
//     AppStore.init();
//   }, []);
//   return (
//     <WagmiConfig client={client}>
//       <RainbowKitAuthenticationProvider
//         status={AppStore.auth.status}
//         adapter={createRainbowAuthAdapter({
//           onVerifySuccess: () => AppStore.auth.getStatus(),
//           onLogoutSuccess: () => AppStore.auth.getStatus(),
//         })}
//       >
//         <RainbowKitProvider
//           appInfo={{ appName: env.app.name }}
//           chains={chains}
//           theme={theme}
//         >
//           <Component {...pageProps} />
//           <ToastContainer
//             position={"bottom-right"}
//             autoClose={5000}
//             hideProgressBar
//           />
//         </RainbowKitProvider>
//       </RainbowKitAuthenticationProvider>
//     </WagmiConfig>
//   );
// }
