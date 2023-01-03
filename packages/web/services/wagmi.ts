import {
  connectorsForWallets,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { GetSiweMessageOptions } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { configureChains, createClient, goerli, mainnet } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import env from "../environment";
import { isProduction, vars } from "./../environment/vars";

export const { chains, provider, webSocketProvider } = configureChains(
  [isProduction() ? mainnet : goerli],
  [alchemyProvider({ apiKey: vars.AlchemyKey }), publicProvider()]
);

const { wallets } = getDefaultWallets({ appName: env.app.name, chains });
const connectors = connectorsForWallets([...wallets]);
export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in",
});
