import {
  connectorsForWallets,
  createAuthenticationAdapter,
  getDefaultWallets,
  Wallet,
} from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import { Chain, configureChains, createClient, goerli, mainnet } from "wagmi";
import { SafeConnector, SafeConnectorOptions } from "wagmi/connectors/safe";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import env from "../environment";
import { isProd, vars } from "./../environment/vars";
import Http from "./http";

const targetNetwork = isProd() ? mainnet : goerli;

export const { chains, provider, webSocketProvider } = configureChains(
  [targetNetwork],
  [alchemyProvider({ apiKey: vars.AlchemyKey }), publicProvider()]
);

// See the official integration guide for auto-connecting
// https://github.com/safe-global/safe-apps-sdk/tree/main/packages/safe-apps-wagmi#integration-steps
export const safeWallet = ({
  chains,
  options = {},
}: {
  chains: Chain[];
  options?: SafeConnectorOptions;
}): Wallet => ({
  id: "SAFE",
  name: "Safe",
  iconUrl: "/images/twitter-card.png",
  hidden: () => false,
  iconBackground: "#000",
  createConnector: () => ({
    connector: new SafeConnector({ chains, options }),
  }),
});

const { wallets } = getDefaultWallets({ appName: env.app.name, chains });
const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [safeWallet({ chains })],
  },
]);
export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

interface CreateRainbowAdapterProps {
  onVerifySuccess: (address: string) => void;
  onLogoutSuccess: () => void;
}

export const createRainbowAuthAdapter = ({
  onVerifySuccess,
  onLogoutSuccess,
}: CreateRainbowAdapterProps) =>
  createAuthenticationAdapter({
    getNonce: async () => {
      const { data } = await Http.getNonce();
      return data.nonce;
    },
    createMessage: ({ nonce, address, chainId }) => {
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to wanwan",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
    },
    getMessageBody: ({ message }: { message: SiweMessage }) => {
      return message.prepareMessage();
    },
    verify: async ({ message, signature }) => {
      const res = await Http.login({ message, signature });
      if (res.status === 201) {
        await onVerifySuccess(res.data.address);
        return true;
      }
      return false;
    },
    signOut: async () => {
      try {
        await Http.logout();
      } catch (e) {
        console.log(e);
      } finally {
        await onLogoutSuccess();
      }
    },
  });
